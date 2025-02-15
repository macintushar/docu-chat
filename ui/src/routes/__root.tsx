import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Create a client
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SidebarProvider className="font-base">
          <AppSidebar />
          <div className="flex w-full text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center justify-center h-full">
              <SidebarTrigger />
            </div>
            <main className="w-full p-6 pt-3 pl-0 max-h-screen">
              <Outlet />
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
