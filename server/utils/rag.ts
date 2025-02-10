import { z } from "zod";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";

import {
  chunkText,
  cosineSimilarity,
  getEmbeddings,
  queryOllama,
  queryOllamaStream,
} from "./utils";
import { QueryRequest } from "../types";
import { db, getAllDocuments, getUniqueDocuments, insertDocument } from "./db";

import { MessageType } from "../../ui/src/types";
import { serveStatic } from "hono/bun";

// Initialize Hono ragApp
const ragApp = new Hono();

// File upload endpoint
ragApp.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const text = await file.text();
    const chunks = chunkText(text);

    // Process chunks in batches to avoid overwhelming Ollama
    const batchSize = 5;
    const batches: string[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      batches.push(batch);
    }

    const file_id = uuidv4();

    // Begin transaction for batch insert
    db.transaction(async () => {
      for (const batch of batches) {
        for (const chunk of batch) {
          const processChunk = async () => {
            const embedding = await getEmbeddings(chunk);
            const id = uuidv4();
            // insertDocument.run({
            //   $id: id,
            //   $content: chunk,
            //   $filename: file.name,
            //   $embedding: Buffer.from(embedding.buffer),
            // });
            insertDocument({
              $id: id,
              $content: chunk,
              $file_id: file_id,
              $filename: file.name,
              $embedding: Buffer.from(embedding.buffer),
              $file: Buffer.from(await file.arrayBuffer()),
              $file_type: file.type,
            });
          };
          await processChunk();
        }
      }
    })();

    return c.json({ message: "File processed successfully" });
  } catch (error) {
    console.error("Error processing file:", error);
    return c.json({ error: "Error processing file" }, 500);
  }
});

// Query endpoint
ragApp.post("/query", async (c) => {
  try {
    const { question } = await c.req.json<QueryRequest>();
    const queryEmbedding = await getEmbeddings(question);

    // Get all documents and find most similar ones
    const documents = getAllDocuments() as {
      id: string;
      content: string;
      filename: string;
      embedding: Buffer;
    }[];

    const similarities = documents.map((doc) => ({
      document: doc,
      similarity: cosineSimilarity(
        queryEmbedding,
        new Float32Array(doc.embedding.buffer)
      ),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);
    const topDocs = similarities.slice(0, 2);

    // Build context from most similar documents
    const context = topDocs.map((doc) => doc.document.content).join("\n");

    // Construct prompt
    const prompt = `Use the following context to answer the question. If the answer cannot be found in the context, say "I cannot find the answer in the provided documents." Format all answers in markdown.

Context:
${context}

Question: ${question}`;
    // Get response from Ollama
    const answer = await queryOllama(prompt);

    return c.json({ answer });
  } catch (error) {
    console.error("Error processing query:", error);
    return c.json({ error: "Error processing query" }, 500);
  }
});

// Query endpoint
ragApp.post(
  "/query-stream",
  zValidator(
    "json",
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        })
      ),
      context_enabled: z.boolean(),
    })
  ),
  async (c) => {
    try {
      const { messages, context_enabled } = await c.req.valid("json");

      let finalMessages = [...messages];

      if (context_enabled) {
        const queryEmbedding = await getEmbeddings(
          messages[messages.length - 1].content
        );

        // Get all documents and find most similar ones
        const documents = getAllDocuments() as {
          id: string;
          content: string;
          filename: string;
          embedding: Buffer;
        }[];

        const similarities = documents.map((doc) => ({
          document: doc,
          similarity: cosineSimilarity(
            queryEmbedding,
            new Float32Array(doc.embedding.buffer)
          ),
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);
        const topDocs = similarities.slice(0, 2);

        // Build context from most similar documents
        const context = topDocs.map((doc) => doc.document.content).join("\n");

        // Construct prompt
        const prompt = `Answer the question based on your knowledge. Format all answers in markdown. Use the following context to help answer the question. If the answer cannot be found in the context, say "I cannot find the answer in the provided documents.". If the context is not relevant to the question, answer the question based on your knowledge.

      Context:
      ${context}`;

        finalMessages.splice(messages.length - 1, 0, {
          role: "system",
          content: prompt,
        });

        finalMessages[messages.length - 1].content = prompt;
      }

      // Get stream from Ollama
      const stream = await queryOllamaStream(finalMessages);

      // Set appropriate headers for streaming
      c.header("Content-Type", "text/event-stream");
      c.header("Cache-Control", "no-cache");
      c.header("Connection", "keep-alive");

      // Create a readable stream
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      console.error("Error processing query:", error);
      return c.json({ error: "Error processing query" }, 500);
    }
  }
);

ragApp.get("/", (c) => {
  return c.text("Hello from RAG App");
});

ragApp.get("/documents", (c) => {
  const documents = getUniqueDocuments();
  return c.json(documents);
});

ragApp.get("/documents/:fileId", async (c) => {
  try {
    const fileId = c.req.param("fileId");
    const stmt = db.prepare(
      "SELECT file, filename, file_type FROM documents WHERE file_id = ? LIMIT 1"
    );
    const document = stmt.get(fileId) as
      | { file: Buffer; filename: string; file_type: string }
      | undefined;

    if (!document) {
      return c.json({ error: "File not found" }, 404);
    }

    console.log(document);

    // // Set appropriate headers for file download
    // c.header("Content-Type", document.file_type);
    // c.header(
    //   "Content-Disposition",
    //   `attachment; filename="${document.filename}"`
    // );
    const file = new Blob([document.file], { type: document.file_type });
    // Convert Blob to ArrayBuffer and then to Response
    const arrayBuffer = await file.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": document.file_type,
        "Content-Disposition": `attachment; filename="${document.filename}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return c.json({ error: "Error downloading file" }, 500);
  }
});

export default ragApp;
