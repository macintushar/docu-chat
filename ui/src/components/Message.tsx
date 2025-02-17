import { MessageType } from "@/types";
import { useThinkContent } from "@/utils";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Button } from "./ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Message({
  message,
  setThoughtProcess,
}: {
  message: MessageType;
  setThoughtProcess: (thoughtProcess: string) => void;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const { thinkContent, cleanContent } = useThinkContent({
    role: "assistant",
    content: message.content,
  });

  const handleCopyMessage = () => {
    try {
      navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message", error);
      toast.error("Failed to copy message");
    }
  };

  useEffect(() => {
    if (thinkContent) {
      setThoughtProcess(thinkContent);
    }
  }, [thinkContent]);

  return (
    <div className="group flex flex-col gap-3">
      <div
        className={
          "w-full rounded-lg prose dark:prose-invert p-2 " +
          (message.role === "user" ? "dark:bg-zinc-800 bg-zinc-200" : "")
        }
      >
        {thinkContent && (
          <div
            className="alert alert-info cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 w-fit px-2 py-1 rounded-md"
            onClick={() => setThoughtProcess(thinkContent)}
          >
            Thinking...
          </div>
        )}
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {cleanContent}
        </Markdown>
      </div>
      {message.role === "assistant" && cleanContent.length > 0 && (
        <Button
          variant="ghost"
          className="group-hover:visible invisible hover:cursor-pointer w-fit"
          onClick={handleCopyMessage}
        >
          <div className="flex gap-2 align-middle items-center justify-start w-full">
            {isCopied ? <CheckIcon /> : <CopyIcon />}
            {isCopied ? "Copied" : "Copy Message"}
          </div>
        </Button>
      )}
    </div>
  );
}
