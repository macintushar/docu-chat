import { ChatSession } from "@/types";
import Header from "./Header";
import { Button } from "./ui/button";
import { ChatSessionCard } from "./ChatSessionCard";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { PanelLeftOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";

type ChatSessionsProps = {
  sessions: ChatSession[];
  handleSessionCreate: () => void;
  handleSessionDelete: (sessionId: string) => void;
  handleSessionNavigate: (sessionId: string) => void;
};

function BaseChatSessions({
  sessions,
  handleSessionCreate,
  handleSessionDelete,
  handleSessionNavigate,
}: ChatSessionsProps) {
  return (
    <>
      <div className="flex flex-col gap-2 border-b pb-5">
        <Header title="Chats" />
        <Button size="lg" onClick={handleSessionCreate}>
          + New Chat
        </Button>
      </div>
      {sessions && sessions.length > 0 && (
        <div className="flex flex-col gap-2 pt-5">
          {sessions.map((session) => (
            <ChatSessionCard
              key={session.session_id}
              session={session}
              navigateToSession={handleSessionNavigate}
              handleDeleteSession={handleSessionDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function ChatSessions({
  sessions,
  handleSessionCreate,
  handleSessionDelete,
  handleSessionNavigate,
}: ChatSessionsProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="flex flex-col h-full w-1/5">
        <BaseChatSessions
          sessions={sessions}
          handleSessionCreate={handleSessionCreate}
          handleSessionDelete={handleSessionDelete}
          handleSessionNavigate={handleSessionNavigate}
        />
      </div>
    );
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon">
          <PanelLeftOpenIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <BaseChatSessions
          sessions={sessions}
          handleSessionCreate={handleSessionCreate}
          handleSessionDelete={handleSessionDelete}
          handleSessionNavigate={handleSessionNavigate}
        />
      </SheetContent>
    </Sheet>
  );
}
