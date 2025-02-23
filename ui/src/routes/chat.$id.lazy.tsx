import Chats from "@/views/Chats";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/chat/$id")({
  component: Chats,
});
