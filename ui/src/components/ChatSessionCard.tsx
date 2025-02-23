import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChatSession } from "@/types";

import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";

export function ChatSessionCard({
  session,
  navigateToSession,
  handleDeleteSession,
}: {
  session: ChatSession;
  navigateToSession: (sessionId: string) => void;
  handleDeleteSession: (sessionId: string) => void;
}) {
  return (
    <Card
      key={session.session_id}
      onClick={() => navigateToSession(session.session_id)}
      className="cursor-pointer px-4 py-2 flex flex-row justify-between"
    >
      <h1 className="text-lg font-bold truncate">{session.title}</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer w-8 min-w-8 max-w-8"
          >
            <EllipsisVerticalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-fit h-fit p-0">
          <Button
            variant="ghost"
            className="cursor-pointer text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSession(session.session_id);
            }}
          >
            <Trash2Icon className="w-4 h-4" />
            Delete Session
          </Button>
        </PopoverContent>
      </Popover>
    </Card>
  );
}
