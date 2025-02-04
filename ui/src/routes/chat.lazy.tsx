import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "@/views/Chat";

export const Route = createLazyFileRoute("/chat")({
  component: Chat,
});
