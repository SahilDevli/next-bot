import { createOpenAI } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";

export const runtime = "nodejs";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.startsWith("audio/")) {
      return Response.json({ error: "Unsupported audio type." }, { status: 415 });
    }

    const buffer = await request.arrayBuffer();

    if (buffer.byteLength === 0) {
      return Response.json({ error: "No audio received." }, { status: 400 });
    }

    if (buffer.byteLength > MAX_BYTES) {
      return Response.json({ error: "Recording is too large." }, { status: 413 });
    }

    const { text } = await transcribe({
      model: openai.transcription("gpt-4o-mini-transcribe"),
      audio: new Uint8Array(buffer),
    });

    return Response.json({ text: text.trim() });
  } catch (error) {
    console.error("Transcription error:", error);
    return Response.json(
      { error: "Unable to transcribe audio right now." },
      { status: 500 }
    );
  }
}