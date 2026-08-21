import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/db/models/post";
import { updatePostSchema } from "@/lib/validation/post";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, forbidden, notFound, validationError, serverError } from "@/lib/api/respond";

async function loadOwnedPost(id: string, userId: string) {
  const post = await Post.findById(id);
  if (!post) return { post: null, error: notFound("Post not found") };
  if (post.userId !== userId) return { post: null, error: forbidden() };
  return { post, error: null };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const { post, error } = await loadOwnedPost(params.id, userId);
    if (error) return error;

    return ok({ status: "success", post });
  } catch (error) {
    return serverError(error, "Failed to load post");
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = updatePostSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    await connectDB();
    const { post, error } = await loadOwnedPost(params.id, userId);
    if (error) return error;

    Object.assign(post!, parsed.data);
    await post!.save();

    return ok({ status: "success", post });
  } catch (error) {
    return serverError(error, "Failed to update post");
  }
}
