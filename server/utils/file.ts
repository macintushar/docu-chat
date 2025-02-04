import { chunkText } from "./utils";

export async function readAndChunkFile(file: File) {
  const text = await file.text();
  const chunks = chunkText(text);
  return chunks;
}
