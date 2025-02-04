import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen overflow-scroll">
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/about"
            activeProps={{
              className: "font-bold",
            }}
          >
            About
          </Link>
          <Link
            to="/knowledge"
            activeProps={{
              className: "font-bold",
            }}
          >
            Knowledge
          </Link>
          <Link
            to="/chat"
            activeProps={{
              className: "font-bold",
            }}
          >
            Chat
          </Link>
        </div>
        <hr />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}
