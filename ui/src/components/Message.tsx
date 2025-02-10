import { MessageType } from "@/types";
import { useThinkContent } from "@/utils";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "./ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CodeBlock from "./CodeBlock";

export default function Message({ message }: { message: MessageType }) {
  const [isCopied, setIsCopied] = useState(false);
  const ref = useRef<SyntaxHighlighter>(null);

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

  return (
    <div className="group flex flex-col gap-3">
      <div
        className={
          "w-full rounded-lg prose dark:prose-invert p-2 " +
          (message.role === "user" ? "dark:bg-zinc-700 bg-zinc-200" : "")
        }
      >
        {thinkContent && <div className="alert alert-info">Thinking...</div>}
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {cleanContent}
        </Markdown>
      </div>
      {message.role === "assistant" && (
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
