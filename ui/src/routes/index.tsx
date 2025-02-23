import { createFileRoute } from "@tanstack/react-router";
import Chats from "@/views/Chats";

export const Route = createFileRoute("/")({
  component: Chats,
});
