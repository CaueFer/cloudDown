import path from "path";
import { create as createYoutubeDl } from "youtube-dl-exec";

// ARRUMA O PATH DO .EXE
const ytDlpPath = path.resolve(
  process.cwd(), // pega o root
  "node_modules/youtube-dl-exec/bin/yt-dlp.exe"
);

// PATH DO FFMPEG
const ffmpegPath = path.join(process.cwd(), "assets", "ffmpeg.exe");
const downloader = createYoutubeDl(ytDlpPath);

export async function POST(request: Request) {
  const body = await request.json();
  const { link, downloadPath } = body;

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

  try {
    const finalPath = path.join(downloadPath, "video.mp4");
    await downloader(validLink.href, {
      output: finalPath,
      writeThumbnail: true,
      ffmpegLocation: ffmpegPath,
    })
      .then((output) => console.log(output))
      .catch((err) => console.error(err));

    return new Response(JSON.stringify({ status: "downloaded" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ status: "error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
