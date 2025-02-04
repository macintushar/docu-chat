// Types
type QueryRequest = {
  question: string;
};

type RAGDocument = {
  id: string;
  content: string;
  filename: string;
  embedding: Float32Array;
};

type OllamaEmbedRequest = {
  model: string;
  prompt: string;
};

type OllamaEmbedResponse = {
  embedding: number[];
};

type OllamaMessage = {
  role: string;
  content: string;
};

type OllamaRequest = {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
};

export type {
  QueryRequest,
  RAGDocument,
  OllamaEmbedRequest,
  OllamaEmbedResponse,
  OllamaMessage,
  OllamaRequest,
};
