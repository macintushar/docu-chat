import { ChatSession, MessageType } from "@/types";
import { useMemo } from "react";

export const getThinkContent = (content: string) => {
  const match = content.match(/<think>([\s\S]*?)(?:<\/think>|$)/);
  return match ? match[1].trim() : null;
};

export function useThinkContent(message: MessageType) {
  const { thinkContent, cleanContent } = useMemo(() => {
    return {
      thinkContent: getThinkContent(message.content),
      cleanContent: message.content
        .replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "")
        .trim(),
    };
  }, [message.content]);

  return { thinkContent, cleanContent };
}

export function addToSessionStorage(message: MessageType) {
  const sessionStorage = window.sessionStorage;
  const storedMessages = sessionStorage.getItem("messages");
  try {
    const messages = JSON.parse(storedMessages || "[]");
    sessionStorage.setItem("messages", JSON.stringify([...messages, message]));
    return true;
  } catch (error) {
    console.error("Error adding message to session storage:", error);
    return false;
  }
}

export function getMessagesFromSessionStorage() {
  const sessionStorage = window.sessionStorage;
  const storedMessages = sessionStorage.getItem("messages");
  return JSON.parse(storedMessages || "[]");
}

export function clearSessionStorage() {
  window.sessionStorage.removeItem("messages");
}

export function titleCase(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
