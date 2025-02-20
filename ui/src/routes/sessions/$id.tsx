import Chat from "@/views/Chat";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <Chat title={`Session ${id}`} />;
  },
});

function RouteComponent() {
  return <div>Hello "/sessions/$id"!</div>;
}
