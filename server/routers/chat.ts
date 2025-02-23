import { Hono } from "hono";
import { generateTitle, getOllamaModels } from "../utils";

const chatRouter = new Hono();

chatRouter.get("/configs", async (c) => {
  const ollamaModels = await getOllamaModels();
  return c.json({
    configs: {
      models: ollamaModels.models,
    },
  });
});

chatRouter.post("/generate-title", async (c) => {
  const { messages, model } = await c.req.json();
  const title = await generateTitle(messages, model);
  return c.json({ title });
});

export default chatRouter;
