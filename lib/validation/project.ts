import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(2000).optional().default(""),
  captionLimit: z.coerce.number().int().min(1).max(2200).optional().default(100),
  postLimit: z.coerce.number().int().min(1).max(1000).optional().default(10),
  hashtags: z.coerce.boolean().optional().default(true),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  captionLimit: z.coerce.number().int().min(1).max(2200).optional(),
  postLimit: z.coerce.number().int().min(1).max(1000).optional(),
  hashtags: z.coerce.boolean().optional(),
  connections: z
    .object({
      facebook: z.boolean().optional(),
    })
    .optional(),
});

export const setAccessSchema = z.object({
  token: z.string().min(1, "Token is required"),
  connection: z.literal("facebook"),
});
