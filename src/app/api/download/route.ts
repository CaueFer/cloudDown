import path from "path";
import { NextRequest } from "next/server";
import { create as createYoutubeDl } from "youtube-dl-exec";

// ARRUMA O PATH DO .EXE
const ytDlpPath = path.resolve(
  process.cwd(), // pega o root
  "node_modules/youtube-dl-exec/bin/yt-dlp.exe"
);
const youtubeDl = createYoutubeDl(ytDlpPath);

// PATH DO FFMPEG
const ffmpegPath = path.join(process.cwd(), "assets", "ffmpeg.exe");

function linkValidator(link: string | null) {
  try {
    if (link && link.trim() !== "") {
      return [null, new URL(link)];
    }

    throw new Error();
  } catch (err) {
    console.error(err);
    return ["Invalid Url", null];
  }
}

const SSEHelper = ({
  event,
  data,
}: {
  event: string;
  data: Record<string, unknown>;
}) => `event:${event}\ndata:${JSON.stringify(data)}\n\n`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const [link, downloadPath] = [
    searchParams.get("link"),
    searchParams.get("dPath"),
  ];

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      if (!downloadPath || downloadPath.trim() === "") {
        controller.enqueue(
          encoder.encode(
            SSEHelper({
              event: "status",
              data: {
                status: "error",
                error: "Invalid Download Folder Path.",
              },
            })
          )
        );

        controller.close();
        return;
      }

      const [error, validLink] = linkValidator(link);

      if (error) {
        controller.enqueue(
          encoder.encode(
            SSEHelper({
              event: "status",
              data: {
                status: "error",
                error: error,
              },
            })
          )
        );

        controller.close();
        return;
      }

      // const finalPath = path.join(downloadPath, "%(title)s.%(ext)s");

      // CRIA O SUBPROCESSO PARA DOWNLOAD
      const subprocess = youtubeDl.exec(
        String(validLink),
        {
          newline: true,
          ffmpegLocation: ffmpegPath,
          writeThumbnail: false,
          paths: downloadPath,
          output: "%(title)s.%(ext)s",
          mergeOutputFormat: "mkv",
          // verbose: true,
        },
        { stdio: ["ignore", "pipe", "pipe"] }
      );

      try {
        // LE O STDOUT DO PROCESSO
        subprocess.stdout?.on("data", (data) => {
          const lines = data.toString().split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;
            if (line.startsWith("Destination")) continue;

            if (line.startsWith("[download]")) {
              const content = line.replace(/^\[download]\s*/, "").split("%")[0];

              let title = "Downloading...";
              if (content.includes("Destination")) {
                const parts = content.split("\\")[-1];
                title = parts[parts.lenght - 1].replace(/\.[^/]+$/);
              }

              if (content === "NA") {
                console.log("[Progress] Progress unavailable (NA)");
                controller.enqueue(
                  encoder.encode(
                    SSEHelper({
                      event: "status",
                      data: {
                        status: "downloading",
                        progress: 10,
                        title,
                      },
                    })
                  )
                );
                continue;
              }

              if (content.includes("has already been downloaded")) {
                console.log("[ALREADY]:", content);

                const parts = content.split("\\")[-1];
                title = parts[parts.lenght - 1].replace(/\.[^/]+$/);

                controller.enqueue(
                  encoder.encode(
                    SSEHelper({
                      event: "status",
                      data: {
                        status: "downloaded",
                        progress: 100,
                        title,
                      },
                    })
                  )
                );
                return;
              }

              // TRAZER TITLE PARA FRONT

              console.log("[PROGRESS]: ", content + "%");

              controller.enqueue(
                encoder.encode(
                  SSEHelper({
                    event: "status",
                    data: {
                      status: "downloading",
                      progress: content,
                      title,
                    },
                  })
                )
              );
            }
          }
        });

        // HANDLER DE ERRO
        subprocess.stderr?.on("data", (data) => {
          console.error("[yt-dlp error]", data.toString());

          subprocess.stdout?.removeAllListeners();
          subprocess.stderr?.removeAllListeners();
          controller.close();
        });

        // HANDLE EXIT CODE
        subprocess.on("close", (code) => {
          controller.enqueue(
            encoder.encode(
              SSEHelper({
                event: "status",
                data: {
                  status: code === 0 ? "downloaded" : "error",
                },
              })
            )
          );

          subprocess.stdout?.removeAllListeners();
          subprocess.stderr?.removeAllListeners();
          controller.close();
        });
      } catch (err) {
        console.error(err);

        controller.enqueue(
          encoder.encode(
            SSEHelper({
              event: "status",
              data: {
                status: "error",
                message: err instanceof Error ? err.message : String(err),
              },
            })
          )
        );

        controller.close();
        return;
      }
    },
    cancel() {
      console.log("Stream canceled, downloader process terminated.");
    },
  });

  // RETORNA O STREAM
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
