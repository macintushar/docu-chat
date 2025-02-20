import { Hono } from "hono";
import { getOllamaModels } from "../utils";
import { createChatSession, getAllChatSessions, getChatSession } from "../db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { messagesSchema } from "../schemas";

const chatRouter = new Hono();

chatRouter.get("/configs", async (c) => {
  const ollamaModels = await getOllamaModels();
  return c.json({
    configs: {
      models: ollamaModels.models,
    },
  });
});

chatRouter.get("/sessions", async (c) => {
  const sessions = getAllChatSessions();
  return c.json({
    sessions,
  });
});

chatRouter.post(
  "/sessions/new",
  zValidator("json", z.object({ session_name: z.string() })),
  async (c) => {
    const { session_name } = await c.req.valid("json");
    const session = createChatSession({
      $session_name: session_name,
      $messages: "",
    });
    return c.json({ session });
  }
);

chatRouter.get("/sessions/:id", async (c) => {
  const { id } = c.req.param();
  const session = getChatSession(parseInt(id));
  return c.json({ session });
});

export default chatRouter;
