import { useThinkContent } from '@/utils';
import { createLazyFileRoute } from '@tanstack/react-router'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export const Route = createLazyFileRoute('/about')({
  component: RouteComponent,
})


const md = `<think>
Okay, I'm trying to figure out what "Draw" is based on the provided context. Let me read through the information given. 

The context starts with a logo image and some code for a CodeClimate badge, which probably shows something about maintainability. Then there's a description: Draw is a wrapper around Excalidraw, integrated with Supabase. It allows using Excalidraw anywhere while keeping data synced across devices.

Looking at the features section, it mentions Excalidraw integration and a Supabase backend for authentication and storage. There's also cross-platform sync since drawings are saved to Supabase. 

In the "Getting Started" section, they talk about signing up, creating/editing drawings with Excalidraw, saving them automatically to Supabase, and accessing from any device after logging in.

Deployment options are mentioned using Vercel or Docker. 

So, putting it all together, Draw is a web application that lets users create and manage drawings using Excalidraw, with their data stored securely on Supabase for syncing across devices.
</think>

Draw is a web application that integrates the open-source drawing tool Excalidraw with Supabase for secure authentication and storage. It allows users to create, edit, and save their drawings, which are then synced across all their devices through Supabase. The app can be deployed using platforms like Vercel or Docker.

**Answer:**  
Draw is a web application that integrates Excalidraw with Supabase, enabling the creation, editing, and syncing of drawings securely across various devices.`

function RouteComponent() {
  const { thinkContent, cleanContent } = useThinkContent({
    role: "assistant",
    content: md,
  });

  console.log(cleanContent);
  
  return (
    <div className="prose">
      {thinkContent && <div className="alert alert-info">Thinking...</div>}
      <Markdown  
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
      >
        {cleanContent}
      </Markdown>
    </div>
  );
}
