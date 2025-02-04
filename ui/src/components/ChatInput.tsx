import { useState } from "react";

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
}: {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
}) {
  const [prevKey, setPrevKey] = useState("");
  return (
    <textarea
      name="input"
      id="chat-input"
      placeholder="Type your message here..."
      className="w-full resize-none text-base leading-6 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={3}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
          setInput("");
        }
      }}
    ></textarea>
  );
}
