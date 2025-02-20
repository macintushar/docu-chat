import Sessions from "@/views/Sessions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Sessions />;
}
