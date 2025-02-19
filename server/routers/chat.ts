import { Hono } from "hono";
import { getOllamaModels } from "../utils";

const chatRouter = new Hono();

chatRouter.get("/configs", async (c) => {
  const ollamaModels = await getOllamaModels();
  return c.json({
    configs: {
      models: ollamaModels.models,
    },
  });
});

export default chatRouter;
