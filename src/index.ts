import { Hono } from "hono";
import ragApp from "./rag";
import { initDB } from "./db";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/page", serveStatic({ path: "./src/templates/index.html" }));

app.route("/rag", ragApp);

// Initialize database
console.log("Initializing...");
initDB();

export default {
  port: 8080,
  fetch: app.fetch,
};
