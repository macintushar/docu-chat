import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Message from "@/components/Message";
import { Button } from "@/components/ui/button";
import { askOllamaStream } from "@/services";
import { MessageType } from "@/types";
import {
  addToSessionStorage,
  clearSessionStorage,
  getMessagesFromSessionStorage,
} from "@/utils";
import { RefreshCw } from "lucide-react";

import { useEffect, useState } from "react";

export default function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [contextEnabled, setContextEnabled] = useState(false);

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

    const data = await askOllamaStream(messages, contextEnabled);
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
        setIsLoading(false);
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
    <div className="flex flex-col items-center max-h-full h-full w-full">
      <Header
        title="Chat"
        subtitle="Ask the LLM anything about the documents in the knowledge base."
        cta={
          <Button
            variant="outline"
            onClick={() => {
              setMessages([]);
              clearSessionStorage();
            }}
          >
            <RefreshCw />
            Clear Chat
          </Button>
        }
      />
      <div className="h-full overflow-scroll w-4/5 mt-4 px-4">
        {messages.map((msg, idx) => (
          <div
            className={`w-full my-2 flex ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
            key={idx}
          >
            <Message
              message={{ role: msg.role, content: msg.content }}
              key={idx}
            />
          </div>
        ))}
        {isLoading && <>Loading...</>}
      </div>
      <div className="w-4/5">
        <ChatInput
          input={question}
          setInput={setQuestion}
          handleSubmit={askQuestionStream}
          contextEnabled={contextEnabled}
          setContextEnabled={setContextEnabled}
        />
      </div>
    </div>
  );
}
