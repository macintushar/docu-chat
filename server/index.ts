import server from "./server";

try {
  Bun.serve({
    port: process.env.SERVER_PORT || 3030,
    fetch: server.fetch,
  });
} catch (error) {
  console.error(error);
}
