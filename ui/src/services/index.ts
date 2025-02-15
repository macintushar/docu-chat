import {
  KnowledgeDocument,
  KnowledgeDocumentDownload,
  MessageResponse,
  MessageType,
} from "@/types";

export const API_BASE_PATH = "/api/v1";

export async function askOllama(question: string) {
  const response = await fetch(`${API_BASE_PATH}/rag/query`, {
    method: "POST",
    body: JSON.stringify({ question: question }),
  });
  console.log("here");

  const data = await response.json();
  return data;
}

export async function askOllamaStream(
  messages: MessageType[],
  contextEnabled: boolean,
) {
  const response = await fetch(`${API_BASE_PATH}/rag/query-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
      context_enabled: contextEnabled,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr) {
              yield JSON.parse(jsonStr);
            }
          }
        }
      }
    },
  };
}

export async function uploadDocument(files: FileList) {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i]);
  }

  console.log(formData);

  const response = await fetch("/api/v1/rag/upload", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  return response as MessageResponse;
}

export async function getDocuments() {
  const response = await fetch(`${API_BASE_PATH}/rag/documents`);
  const data = await response.json();
  return data as KnowledgeDocument[];
}

export async function downloadDocument(fileId: string) {
  const response = await fetch(`${API_BASE_PATH}/rag/documents/${fileId}`);
  const data = await response.blob();
  return data;
}
