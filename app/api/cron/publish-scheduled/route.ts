import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import { findDuePosts, publishPost, resumeProcessingPost } from "@/lib/scheduler";
import { ok, unauthorized, serverError } from "@/lib/api/respond";

/**
 * Invoked by Vercel Cron (see vercel.json). Publishes scheduled posts that are
 * due and resumes any post left "processing" because the initial publish
 * request hit the serverless time limit before Instagram finished.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return unauthorized("Invalid cron secret");
  }

  try {
    await connectDB();
    const { scheduled, stuckProcessing } = await findDuePosts();

    let published = 0;
    let failed = 0;

    for (const post of scheduled) {
      const project = await Project.findById(post.projectId);
      if (!project) {
        post.status = "failed";
        post.failureReason = "Project no longer exists";
        await post.save();
        failed++;
        continue;
      }
      await publishPost(post, project);
      post.status === "posted" ? published++ : failed++;
    }

    for (const post of stuckProcessing) {
      await resumeProcessingPost(post);
      post.status === "posted" ? published++ : post.status === "processing" ? null : failed++;
    }

    return ok({ status: "success", processed: scheduled.length + stuckProcessing.length, published, failed });
  } catch (error) {
    return serverError(error, "Failed to run scheduled publish job");
  }
}
