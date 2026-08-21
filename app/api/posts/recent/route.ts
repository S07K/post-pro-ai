import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/db/models/post";
import { requireUserId } from "@/lib/api/session";
import { toPostDTO } from "@/lib/api/serializers";
import { ok, unauthorized, serverError } from "@/lib/api/respond";

/** Recent posts across every project owned by the authenticated user, for the dashboard history feed. */
export async function GET(req: Request) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 12, 50);

    await connectDB();
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    return ok({ status: "success", posts: posts.map(toPostDTO) });
  } catch (error) {
    return serverError(error, "Failed to load recent posts");
  }
}
