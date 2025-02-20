import { z } from "zod";

export const messagesSchema = z.array(
  z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string(),
  })
);
