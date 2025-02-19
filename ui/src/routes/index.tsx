import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/views/Dashboard";
import Chat from "@/views/Chat";

export const Route = createFileRoute("/")({
  component: Chat,
});
