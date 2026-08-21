import { connectDB } from "@/lib/db/mongoose";
import Post, { type PostStatus } from "@/lib/db/models/post";
import Project from "@/lib/db/models/project";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, serverError } from "@/lib/api/respond";

const WEEKS = 8;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function weekLabel(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Real usage analytics computed from the authenticated user's own posts (no fabricated engagement numbers). */
export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const [posts, projectCount] = await Promise.all([
      Post.find({ userId }),
      Project.countDocuments({ userId }),
    ]);

    const byStatus: Record<PostStatus, number> = { draft: 0, scheduled: 0, processing: 0, posted: 0, failed: 0 };
    for (const post of posts) {
      byStatus[post.status as PostStatus]++;
    }

    const now = Date.now();
    const weekBuckets: { week: string; count: number }[] = Array.from({ length: WEEKS }, (_, i) => {
      const bucketStart = new Date(now - (WEEKS - 1 - i) * MS_PER_WEEK);
      return { week: weekLabel(bucketStart), count: 0 };
    });
    for (const post of posts) {
      const age = now - new Date(post.createdAt).getTime();
      const bucketIndex = WEEKS - 1 - Math.floor(age / MS_PER_WEEK);
      if (bucketIndex >= 0 && bucketIndex < WEEKS) {
        weekBuckets[bucketIndex].count++;
      }
    }

    return ok({
      status: "success",
      analytics: {
        totalProjects: projectCount,
        totalPosts: posts.length,
        byStatus,
        postsPerWeek: weekBuckets,
      },
    });
  } catch (error) {
    return serverError(error, "Failed to load analytics");
  }
}
