import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import Message from "@/components/Message";
import ThoughtProcessDialog from "@/components/ThoughtProcessDialog";
import { Button } from "@/components/ui/button";
import { askOllamaStream, generateTitle, getChatConfigs } from "@/services";
import { KnowledgeDocument, MessageType, Model } from "@/types";
import { addToSessionStorage } from "@/utils";
import { getSession, updateSession, updateSessionTitle } from "@/utils/session";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

export default function Chat({
  sessionId,
  refetch,
}: {
  sessionId: string;
  refetch: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [contextEnabled, setContextEnabled] = useState(false);
  const [thoughtProcess, setThoughtProcess] = useState<string>("");
  const [openThoughtProcess, setOpenThoughtProcess] = useState(false);
  const [currentChatModel, setCurrentChatModel] = useState<Model | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<
    KnowledgeDocument[]
  >([]);

  const { data: chatConfigs } = useQuery({
    queryKey: ["chat", "config"],
    queryFn: getChatConfigs,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  async function askQuestionStream() {
    setIsLoading(true);

    try {
      // Add user question and clear input
      updateSession(sessionId, [
        ...(getSession(sessionId)?.messages || []),
        { role: "user", content: question },
      ]);
      setMessages(getSession(sessionId)?.messages || []);
      setQuestion("");

      const messages = getSession(sessionId)?.messages || [];

      // Add initial empty assistant message
      updateSession(sessionId, [
        ...(getSession(sessionId)?.messages || []),
        {
          role: "assistant",
          content: "",
          model: currentChatModel?.model || "",
        },
      ]);
      setMessages(getSession(sessionId)?.messages || []);

      const data = await askOllamaStream(
        messages,
        contextEnabled,
        currentChatModel?.model || "",
      );
      let streamedAnswer = "";

      try {
        for await (const response of data) {
          streamedAnswer += response.message.content;

          // Update the last message (assistant's response) with accumulated stream
          const currentMessages = getSession(sessionId)?.messages || [];
          const updatedMessages: MessageType[] = [
            ...currentMessages.slice(0, -1),
            {
              role: "assistant",
              content: streamedAnswer,
              model: currentChatModel?.model || "",
            },
          ];

          updateSession(sessionId, updatedMessages);
          setMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Error in stream:", error);
        // Update the last (assistant) message with error content
        const currentMessages = getSession(sessionId)?.messages || [];
        const updatedMessages = [
          ...currentMessages.slice(0, -1),
          {
            role: "assistant",
            content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred while streaming the response"}`,
          },
        ];
        window.sessionStorage.setItem(
          "messages",
          JSON.stringify(updatedMessages),
        );
        setMessages(updatedMessages as MessageType[]);
      }
    } catch (error) {
      console.error("Error initiating stream:", error);
      // Add new error message to chat
      addToSessionStorage({
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred while processing your request"}`,
      });
      setMessages(getSession(sessionId)?.messages || []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setMessages(getSession(sessionId)?.messages || []);
  }, [sessionId]);

  useEffect(() => {
    if (chatConfigs && currentChatModel === null) {
      setCurrentChatModel(chatConfigs.configs.models[0]);
    }
  }, [chatConfigs, currentChatModel]);

  useEffect(() => {
    if (messages.length === 2 && !isLoading && currentChatModel) {
      generateTitle(messages, currentChatModel.model).then((title) => {
        console.log(title.title);

        updateSessionTitle(
          sessionId,
          title.title.length > 0 ? title.title : "New Chat",
        );
        refetch();
      });
    }
  }, [messages, isLoading, currentChatModel]);

  if (!currentChatModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center max-h-full h-full w-full">
      {messages.length > 0 ? (
        <div className="h-full overflow-y-scroll scrollbar w-4/5 max-w-4/5 mt-4 px-4 mb-2">
          {messages.map((msg, idx) => (
            <div
              className={`w-full my-2 flex ${
                msg.role === "assistant" ? "justify-start" : "justify-end"
              }`}
              key={idx}
            >
              <Message
                message={{
                  role: msg.role,
                  content: msg.content,
                  model: msg.model,
                }}
                setThoughtProcess={setThoughtProcess}
                setOpenThoughtProcess={setOpenThoughtProcess}
                key={idx}
              />
            </div>
          ))}
          {isLoading && <>Loading...</>}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-zinc-200 text-center">
            <p>No messages yet.</p>
            <p>Start a conversation by asking a question below.</p>
          </div>
        </div>
      )}
      <div className="w-4/5">
        <ChatInput
          input={question}
          setInput={setQuestion}
          handleSubmit={askQuestionStream}
          contextEnabled={contextEnabled}
          setContextEnabled={setContextEnabled}
          availableModels={chatConfigs?.configs.models || []}
          currentChatModel={currentChatModel}
          changeModel={setCurrentChatModel}
          selectedDocuments={selectedDocuments}
          setSelectedDocuments={setSelectedDocuments}
        />
      </div>
      <ThoughtProcessDialog
        thoughtProcess={thoughtProcess}
        open={openThoughtProcess}
        setOpen={setOpenThoughtProcess}
      />
    </div>
  );
}
