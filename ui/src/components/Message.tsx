import { MessageType } from "@/types";
import { useThinkContent } from "@/utils";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function Message({ message }: { message: MessageType }) {
  const { thinkContent, cleanContent } = useThinkContent({
    role: "assistant",
    content: message.content,
  });
  return (
    <div
      className={
        "p-3 w-full rounded-lg whitespace-pre-wrap prose" +
        (message.role === "assistant" ? " bg-green-50" : " bg-green-100")
      }
    >
      {thinkContent && <div className="alert alert-info">Thinking...</div>}
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {cleanContent}
      </Markdown>
    </div>
  );
}
