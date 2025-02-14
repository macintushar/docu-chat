import { db } from "./db";
import {
  OllamaEmbedRequest,
  OllamaEmbedResponse,
  OllamaRequest,
} from "../types";
import { MessageType } from "../../ui/src/types";

import { Ollama } from "ollama";

const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
const ollamaChatModel = process.env.OLLAMA_CHAT_MODEL || "llama3.2:latest";
const ollamaEmbeddingModel =
  process.env.OLLAMA_EMBEDDING_MODEL || "bge-m3:latest";

const ollama = new Ollama({
  host: ollamaHost,
});

// Text chunking function
function chunkText(text: string, chunkSize: number = 1000): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    currentLength += word.length + 1;
    if (currentLength > chunkSize) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [word];
      currentLength = word.length;
    } else {
      currentChunk.push(word);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

// Get embeddings using Ollama
async function getEmbeddings(text: string): Promise<Float32Array> {
  const request: OllamaEmbedRequest = {
    model: ollamaEmbeddingModel,
    prompt: text,
  };

  console.log("Embedding model: ", request.model);

  const response = await fetch(`${ollamaHost}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as OllamaEmbedResponse;
  return new Float32Array(data.embedding);
}

// Query Ollama
async function queryOllama(prompt: string): Promise<string> {
  const request: OllamaRequest = {
    model: ollamaChatModel,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false,
  };

  console.log("Querying model: ", request.model);

  const response = await fetch(`${ollamaHost}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  console.log(data);

  return data.message.content;
}

async function queryOllamaStream(messages: MessageType[]) {
  return await ollama.chat({
    model: ollamaChatModel,
    messages: messages,
    stream: true,
  });
}

// Cosine similarity function
function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Replace the cosineSimilarity function with this euclideanSimilarity function
function euclideanSimilarity(a: Float32Array, b: Float32Array): number {
  let sumSquaredDifferences = 0;

  for (let i = 0; i < a.length; i++) {
    const difference = a[i] - b[i];
    sumSquaredDifferences += difference * difference;
  }

  // Calculate Euclidean distance
  const distance = Math.sqrt(sumSquaredDifferences);

  // Convert distance to similarity score (closer to 1 means more similar)
  // Using exponential decay formula: similarity = 1 / (1 + distance)
  // This ensures the similarity score is between 0 and 1
  return 1 / (1 + distance);
}

// Initialize database schema
function initDB() {
  // Enable WAL mode for better concurrency
  db.run("PRAGMA journal_mode = WAL");

  // Create documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      filename TEXT NOT NULL,
      embedding BLOB NOT NULL
    )
  `);

  // Create indexes
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_documents_filename
    ON documents(filename)
  `);
}

export {
  chunkText,
  getEmbeddings,
  queryOllama,
  queryOllamaStream,
  cosineSimilarity,
  euclideanSimilarity,
  initDB,
};
