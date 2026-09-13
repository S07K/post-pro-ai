import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";
import { createPostSchema } from "@/lib/validation/post";
import { publishPost } from "@/lib/scheduler";
import { requireUserId } from "@/lib/api/session";
import { toPostDTO } from "@/lib/api/serializers";
import { ok, unauthorized, forbidden, notFound, validationError, serverError } from "@/lib/api/respond";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = createPostSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }
    const { projectId, image, caption, hashtags, scheduledAt } = parsed.data;

    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) return notFound("Project not found");
    if (project.userId !== userId) return forbidden();

    const post = await Post.create({
      projectId,
      userId,
      image,
      caption,
      hashtags,
      status: scheduledAt ? "scheduled" : "draft",
      scheduledAt: scheduledAt ?? null,
    });

    if (!scheduledAt) {
      // Publish immediately; publishPost persists whatever status the attempt lands on.
      await publishPost(post, project);
    }

    return ok({ status: "success", post: toPostDTO(post) });
  } catch (error) {
    return serverError(error, "Failed to create post");
  }
}
