import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().trim().min(4, "Minimum 4 letters requied"),
  content: z.string().trim().min(10, "minimum 10 letters requied"),
});
