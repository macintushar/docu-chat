import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { askOllama, askOllamaStream } from "@/services/ollama";
import { MessageType } from "@/types";
import { addToSessionStorage, getMessagesFromSessionStorage } from "@/utils";

import { useEffect, useState } from "react";

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  async function askQuestionStream() {
    setIsLoading(true);

    // Add user question and clear input
    addToSessionStorage({ role: "user", content: question });
    setMessages(getMessagesFromSessionStorage());
    setQuestion("");

    const messages = getMessagesFromSessionStorage();

    // Add initial empty assistant message
    addToSessionStorage({ role: "assistant", content: "" });
    setMessages(getMessagesFromSessionStorage());

    const data = await askOllamaStream(messages);
    let streamedAnswer = "";

    try {
      for await (const response of data) {
        streamedAnswer += response.message.content;

        // Update the last message (assistant's response) with accumulated stream
        const currentMessages = getMessagesFromSessionStorage();
        const updatedMessages = [
          ...currentMessages.slice(0, -1),
          { role: "assistant", content: streamedAnswer },
        ];

        window.sessionStorage.setItem(
          "messages",
          JSON.stringify(updatedMessages)
        );
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error in stream:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMessages(getMessagesFromSessionStorage());
  }, []);

  return (
    <div className="flex flex-col h-full fixed inset-0 p-6 pt-12 gap-4">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                "w-full flex" +
                (msg.role === "assistant" ? " justify-start" : " justify-end")
              }
            >
              <Message message={{ role: msg.role, content: msg.content }} />
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="animate-pulse text-gray-600 mt-4">
            Processing question...
          </div>
        )}
      </div>

      {/* Input area - fixed at bottom */}
      <div className="flex-none">
        <ChatInput
          input={question}
          setInput={setQuestion}
          handleSubmit={askQuestionStream}
        />
      </div>
    </div>
  );
}
