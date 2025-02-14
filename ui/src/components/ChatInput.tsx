import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  contextEnabled,
  setContextEnabled,
}: {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
  contextEnabled: boolean;
  setContextEnabled: (contextEnabled: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-1 bg-zinc-100 dark:bg-zinc-950/50 rounded-lg">
      <Textarea
        name="input"
        id="chat-input"
        placeholder="Type your message here..."
        className="w-full resize-none text-base leading-6 p-3 rounded-lg focus:outline-none outline-none border-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
            setInput("");
          }
        }}
      />
      <div className="flex items-center justify-end w-full px-4 pb-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={contextEnabled}
              onCheckedChange={(checked) => {
                setContextEnabled(checked === true);
              }}
              className="w-4 h-4"
            />
            <Label htmlFor="terms">Use Document Context</Label>
          </div>
          <Button
            variant="outline"
            onClick={handleSubmit}
            size="icon"
            className="rounded-full"
            disabled={input.length === 0}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
