
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";

import {
  readFile,
} from "node:fs/promises";
import {
  basename,
  relative,
  resolve,
} from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const MAX_CHARS = 1800;
const OVERLAP_CHARS = 180;
const BATCH_SIZE = 50;

type Chunk = {
  source: string;
  chunk_index: number;
  content: string;
  section: string | null;
  clause: string | null;
  subsection: string | null;
  metadata: Record<string, string>;
};

function isDelimiter(line: string): boolean {
  return line.trim().replace(/^\\/, "") === "---";
}

function parseHeading(line: string) {
  // Support both ## Heading and **## Heading**
  const normalized = line
    .trim()
    .replace(/^\*\*(#{1,6}\s.+?)\*\*$/, "$1");

  const match = normalized.match(/^(#{1,6})\s+(.+)$/);

  return match
    ? {
        level: match[1].length,
        title: match[2].trim(),
      }
    : null;
}

function parseMarkdown(markdown: string) {
  const lines = markdown
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  const metadata: Record<string, string> = {};
  let bodyStart = 0;

  // Parse the simple YAML frontmatter at the top.
  if (lines.length && isDelimiter(lines[0])) {
    const end = lines.findIndex(
      (line, index) => index > 0 && isDelimiter(line)
    );

    if (end !== -1) {
      for (const line of lines.slice(1, end)) {
        const match = line.match(/^([\w-]+):\s*(.*?)\s*$/);

        if (match) {
          metadata[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }

      bodyStart = end + 1;
    }
  }

  return {
    metadata,
    lines: lines.slice(bodyStart),
  };
}

function splitLargeText(text: string): string[] {
  const value = text.trim();

  if (!value) return [];

  if (value.length <= MAX_CHARS) {
    return [value];
  }

  const result: string[] = [];
  let start = 0;

  while (start < value.length) {
    let end = Math.min(start + MAX_CHARS, value.length);

    if (end < value.length) {
      const window = value.slice(start, end);

      const boundary = Math.max(
        window.lastIndexOf("\n\n"),
        window.lastIndexOf("\n"),
        window.lastIndexOf(". "),
        window.lastIndexOf(" ")
      );

      if (boundary >= MAX_CHARS * 0.55) {
        end = start + boundary + 1;
      }
    }

    const part = value.slice(start, end).trim();

    if (part) result.push(part);

    if (end >= value.length) break;

    let nextStart = Math.max(
      start + 1,
      end - OVERLAP_CHARS
    );

    // Avoid splitting the next chunk in the middle of a word.
    while (
      nextStart < end &&
      !/\s/.test(value[nextStart])
    ) {
      nextStart++;
    }

    start = nextStart;
  }

  return result;
}

function chunkMarkdown(
  markdown: string,
  source: string
): Chunk[] {
  const { metadata, lines } = parseMarkdown(markdown);

  let title =
    metadata.title ??
    basename(source).replace(/\.md$/i, "");

  let section = "";
  let clause = "";
  let subsection = "";

  let currentBody: string[] = [];
  const chunks: Chunk[] = [];

  function flush() {
    const text = currentBody.join("\n").trim();
    currentBody = [];

    if (!text) return;

    const context = [
      `Document: ${title}`,
      metadata.document_type
        ? `Document type: ${metadata.document_type}`
        : "",
      metadata.organization
        ? `Organization: ${metadata.organization}`
        : "",
      section ? `Section: ${section}` : "",
      clause ? `Clause: ${clause}` : "",
      subsection ? `Subsection: ${subsection}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    for (const part of splitLargeText(text)) {
      chunks.push({
        source,
        chunk_index: chunks.length,
        content: `${context}\n\n${part}`,
        section: section || null,
        clause: clause || null,
        subsection: subsection || null,
        metadata: {
          title,
          organization: metadata.organization ?? "",
          documentType: metadata.document_type ?? "",
        },
      });
    }
  }

  for (const line of lines) {
    const heading = parseHeading(line);

    if (!heading) {
      currentBody.push(line);
      continue;
    }

    flush();

    if (heading.level === 1) {
      if (!metadata.title) title = heading.title;
      continue;
    }

    if (heading.level === 2) {
      section = heading.title;
      clause = "";
      subsection = "";
    } else if (heading.level === 3) {
      clause = heading.title;
      subsection = "";
    } else if (heading.level >= 4) {
      subsection = heading.title;
    }
  }

  flush();

  return chunks;
}

async function main() {
  const openaiKey = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!openaiKey || !supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing OPENAI_API_KEY, SUPABASE_URL, or Supabase server secret."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const openai = createOpenAI({
    apiKey: openaiKey,
  });

  // Pass a file path as the first CLI argument if needed.
  const filePath = resolve(
    process.argv[2] ??
      "./scripts/scriptData/nagarro-constitution-rag.md"
  );

  const source = relative(process.cwd(), filePath)
    .replace(/\\/g, "/");

  const markdown = await readFile(filePath, "utf8");
  const chunks = chunkMarkdown(markdown, source);

  if (chunks.length === 0) {
    throw new Error("No chunks generated. Check the Markdown file.");
  }

  console.log(`Created ${chunks.length} chunks.`);

  // Generate embeddings in batches.
  const rows: Array<
    Chunk & { embedding: number[] }
  > = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const { embeddings, usage } = await embedMany({
      model: openai.embeddingModel("text-embedding-3-small"),
      values: batch.map(chunk => chunk.content),
    });

    if (embeddings.length !== batch.length) {
      throw new Error("Embedding count does not match chunk count.");
    }

    for (let j = 0; j < batch.length; j++) {
      if (embeddings[j].length !== 1536) {
        throw new Error("Expected 1536-dimensional embeddings.");
      }

      rows.push({
        ...batch[j],
        embedding: embeddings[j],
      });
    }

    console.log(
      `Embedded ${Math.min(i + batch.length, chunks.length)}/${chunks.length}` +
      ` (tokens in batch: ${usage.tokens})`
    );
  }

  // Upsert chunks, so rerunning this script doesn't duplicate them.
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from("document_chunks")
      .upsert(batch, {
        onConflict: "source,chunk_index",
      });

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    console.log(
      `Stored ${Math.min(i + batch.length, rows.length)}/${rows.length}`
    );
  }

  // Remove stale chunks if the document became shorter.
  const { error: cleanupError } = await supabase
    .from("document_chunks")
    .delete()
    .eq("source", source)
    .gte("chunk_index", chunks.length);

  if (cleanupError) {
    throw new Error(`Cleanup failed: ${cleanupError.message}`);
  }

  console.log("Ingestion completed successfully!");
  console.log(`Source: ${source}`);
  console.log(`Total chunks stored: ${rows.length}`);
}

main().catch((error: unknown) => {
  console.error("Ingestion failed:", error);
  process.exitCode = 1;
});
