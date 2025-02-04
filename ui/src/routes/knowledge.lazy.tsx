import Knowledge from "@/views/Knowledge";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/knowledge")({
  component: Knowledge,
});
