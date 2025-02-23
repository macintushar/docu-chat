import Chat from "./Chat";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

import { createSession, deleteSession, getSessions } from "@/utils/session";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChatSessionCard } from "@/components/ChatSessionCard";
import ChatSessions from "@/components/ChatSessions";

export default function Chats() {
  const {
    data: sessions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessions(),
  });
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });

  function handleNewSession() {
    const sessionId = createSession();
    refetch();
    navigate({ to: `/chat/${sessionId}` });
  }

  function navigateToSession(sessionId: string) {
    navigate({ to: `/chat/${sessionId}` });
  }

  function handleDeleteSession(sessionId: string) {
    deleteSession(sessionId);
    refetch();
    navigate({ to: "/" });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 h-screen max-h-screen sm:h-full">
      <ChatSessions
        sessions={sessions || []}
        handleSessionCreate={handleNewSession}
        handleSessionDelete={handleDeleteSession}
        handleSessionNavigate={navigateToSession}
      />
      <div className="w-full h-full md:w-4/5">
        {id ? (
          <Chat sessionId={id} />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-200 text-center">
            <p>Select a chat from the left or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
