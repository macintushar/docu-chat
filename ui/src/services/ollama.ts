import { MessageType } from "@/types";

export async function askOllama(question: string) {
  const response = await fetch(`/api/v1/rag/query`, {
    method: "POST",
    body: JSON.stringify({ question: question }),
  });
  console.log("here");

  const data = await response.json();
  return data;
}

export async function askOllamaStream(messages: MessageType[]) {
  const response = await fetch(`/api/v1/rag/query-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
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
