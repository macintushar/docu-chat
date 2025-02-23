import { MessageType } from "../../ui/src/types";

import { Ollama } from "ollama";
import { useThinkContent } from "../../ui/src/utils";

const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
const defaultOllamaChatModel =
  process.env.OLLAMA_CHAT_MODEL || "llama3.2:latest";
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

export async function readAndChunkFile(file: File) {
  const text = await file.text();
  const chunks = chunkText(text);
  return chunks;
}

// Get embeddings using Ollama
async function getEmbeddings(text: string): Promise<Float32Array> {
  const data = await ollama.embeddings({
    model: ollamaEmbeddingModel,
    prompt: text,
  });

  return new Float32Array(data.embedding);
}

async function queryOllamaStream(messages: MessageType[], model: string) {
  console.log("model", model);

  return await ollama.chat({
    model: model || defaultOllamaChatModel,
    messages: messages,
    stream: true,
  });
}

async function getOllamaModels() {
  return await ollama.list();
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

export async function generateTitle(messages: MessageType[], model: string) {
  const titlePrompt = `
  You are a helpful assistant that generates a title for a chat.
  The title should be a short and concise description of the chat.
  The title should be no more than 5 words.
  The title should be a single sentence.
  The title should be a single sentence.
  `;
  const response = await ollama.chat({
    model: model || defaultOllamaChatModel,
    messages: [
      {
        role: "system",
        content: titlePrompt,
      },
      ...messages,
    ],
  });
  if (response.message.content.length <= 5) {
    const { cleanContent } = useThinkContent(response.message);
    return cleanContent;
  }
  return "Untitled Chat";
}

export {
  chunkText,
  getEmbeddings,
  queryOllamaStream,
  getOllamaModels,
  cosineSimilarity,
  euclideanSimilarity,
};
