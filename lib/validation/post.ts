import { z } from "zod";

export const createPostSchema = z
  .object({
    projectId: z.string().min(1, "projectId is required"),
    image: z.string().min(1, "image is required"),
    caption: z.string().trim().max(2200).optional().default(""),
    hashtags: z.string().trim().max(500).optional().default(""),
    scheduledAt: z.coerce.date().optional(),
  })
  .refine((data) => !data.scheduledAt || data.scheduledAt.getTime() > Date.now(), {
    message: "scheduledAt must be in the future",
    path: ["scheduledAt"],
  });

export const updatePostSchema = z.object({
  caption: z.string().trim().max(2200).optional(),
  hashtags: z.string().trim().max(500).optional(),
});

export const generateImageSchema = z.object({
  prompt: z.string().trim().min(1, "prompt is required").max(4000),
  projectId: z.string().min(1, "projectId is required"),
});
