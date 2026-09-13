import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import { generateImageSchema } from "@/lib/validation/post";
import { generatePostImage, OpenAIGenerationError } from "@/lib/openai";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, forbidden, notFound, validationError, fail, serverError } from "@/lib/api/respond";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = generateImageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }
    const { prompt, projectId } = parsed.data;

    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) {
      return notFound("Project not found");
    }
    if (project.userId !== userId) {
      return forbidden();
    }

    const url = await generatePostImage(prompt, projectId);
    return ok({ status: "success", message: "Image generated successfully", data: { url } });
  } catch (error) {
    if (error instanceof OpenAIGenerationError) {
      return fail(error.message, 502);
    }
    return serverError(error, "Failed to generate image");
  }
}
