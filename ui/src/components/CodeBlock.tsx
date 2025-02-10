export default function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-zinc-950 overflow-clip">
      <div className="px-2 bg-zinc-900/70">{language}</div>
      <code className="px-2">{children}</code>
    </div>
  );
}
