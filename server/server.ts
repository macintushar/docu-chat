import { Hono } from "hono";
import ragApp from "./utils/rag";
import { initDB } from "./utils/db";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

// Initialize database
console.log("Initializing...");
initDB();

const server = new Hono();

server.use(logger());

server.get("*", serveStatic({ root: "./ui/dist" }));

server.get("/page", serveStatic({ path: "./server/templates/index.html" }));

server.get("/health", (c) => {
  return c.json({
    status: "ok",
    ollama_host: process.env.OLLAMA_HOST,
    ollama_embedding_model: process.env.OLLAMA_EMBEDDING_MODEL,
    ollama_chat_model: process.env.OLLAMA_CHAT_MODEL,
    database_url: process.env.DATABASE_URL,
  });
});

const apiApp = new Hono().basePath("/v1");

apiApp.get("/", (c) => {
  return c.text("Hello API v1!");
});

apiApp.route("/rag", ragApp);

// Mount API router at /api
server.route("/api", apiApp);

export default server;
