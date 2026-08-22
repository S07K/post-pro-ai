import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";
import { requireUserId } from "@/lib/api/session";
import { toPostDTO } from "@/lib/api/serializers";
import { ok, unauthorized, forbidden, notFound, serverError } from "@/lib/api/respond";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const project = await Project.findById(params.projectId);
    if (!project) return notFound("Project not found");
    if (project.userId !== userId) return forbidden();

    const posts = await Post.find({ projectId: params.projectId }).sort({ createdAt: -1 });
    return ok({ status: "success", posts: posts.map(toPostDTO) });
  } catch (error) {
    return serverError(error, "Failed to load posts");
  }
}
