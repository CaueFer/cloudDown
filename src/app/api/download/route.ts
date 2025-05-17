// import { create as createYoutubeDl } from "youtube-dl-exec";

import path from "path";
import { spawn } from "child_process";
import { NextRequest } from "next/server";

// ARRUMA O PATH DO .EXE
const ytDlpPath = path.resolve(
  process.cwd(), // pega o root
  "node_modules/youtube-dl-exec/bin/yt-dlp.exe"
);

// PATH DO FFMPEG
const ffmpegPath = path.join(process.cwd(), "assets", "ffmpeg.exe");
// const downloader = createYoutubeDl(ytDlpPath);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const [link, downloadPath] = [
    searchParams.get("link"),
    searchParams.get("dPath"),
  ];

  if (!downloadPath || downloadPath.trim() === "")
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Invalid Download Folder Path.",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );

  if (!link || link.trim() === "")
    return new Response(
      JSON.stringify({ status: "error", error: "Invalid URL." }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );

  let validLink;
  try {
    validLink = new URL(link);
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ status: "error", error: "Invalid URL." }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let streamClosed = false;

      try {
        const finalPath = path.join(downloadPath, "%(title)s.%(ext)s");

        // CRIA O SUBPROCESSO PARA DOWNLOAD
        const downloader = spawn(ytDlpPath, [
          String(validLink),
          "--newline",
          "--ffmpeg-location",
          ffmpegPath,
          "--write-thumbnail",
          "-o",
          finalPath,
        ]);

        // LE O STDOUT DO PROCESSO
        downloader.stdout.on("data", (data) => {
          if (streamClosed) return;

          const line = data.toString();
          // Captura o progresso do download
          const match = line.match(/\[download\]\s+([\d.]+)%/);
          if (match) {
            const progress = match[1];
            console.log(`Progresso: ${progress}%`);
            controller.enqueue(
              encoder.encode(
                `event:status\ndata:${JSON.stringify({
                  status: "downloading",
                  progress,
                })}\n\n`
              )
            );
          }
        });

        // HANDLER DE ERRO
        downloader.stderr.on("data", (data) => {
          console.error("[yt-dlp error]", data.toString());

          downloader.stdout.removeAllListeners();
          downloader.stderr.removeAllListeners();
          controller.close();
          streamClosed = true;
        });

        // HANDLE EXIT CODE
        downloader.on("close", (code) => {
          if (!streamClosed) {
            controller.enqueue(
              encoder.encode(
                `event:status\ndata:${JSON.stringify({
                  status: code === 0 ? "downloaded" : "error",
                })}\n\n`
              )
            );

            downloader.stdout.removeAllListeners();
            downloader.stderr.removeAllListeners();
            controller.close();
            streamClosed = true;
          }
        });
      } catch (err) {
        console.error(err);

        if (!streamClosed) {
          controller.enqueue(
            encoder.encode(
              `event:status\ndata:${JSON.stringify({
                status: "error",
                message: err instanceof Error ? err.message : String(err),
              })}\n\n`
            )
          );

          controller.close();
          streamClosed = true;
        }
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-type": "application/json",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
