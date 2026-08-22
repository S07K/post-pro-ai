import Post, { type IPost } from "@/lib/db/models/post";
import Project, { type IProject } from "@/lib/db/models/project";
import { publishToInstagram, finishPendingPublish } from "@/lib/meta";

/** Publishes a draft/scheduled post now. Persists the resulting status on the Post document. */
export async function publishPost(post: IPost, project: IProject): Promise<void> {
  const token = project.connections?.facebook?.token;
  if (!project.connections?.facebook?.isEnabled || !token) {
    post.status = "failed";
    post.failureReason = "Instagram is not connected for this project";
    await post.save();
    return;
  }

  post.status = "processing";
  await post.save();

  const result = await publishToInstagram(token, post.image, `${post.caption} ${post.hashtags}`.trim());
  await applyPublishResult(post, result);
}

/** Resumes a post that was left in "processing" because the initial publish request timed out. */
export async function resumeProcessingPost(post: IPost): Promise<void> {
  if (!post.metaContainerId || !post.metaInstagramId) {
    post.status = "failed";
    post.failureReason = "Missing media container reference";
    await post.save();
    return;
  }
  const project = await Project.findById(post.projectId);
  const token = project?.connections?.facebook?.token;
  if (!token) {
    post.status = "failed";
    post.failureReason = "Instagram connection is no longer available";
    await post.save();
    return;
  }

  const result = await finishPendingPublish(post.metaInstagramId, token, post.metaContainerId);
  await applyPublishResult(post, result);
}

async function applyPublishResult(post: IPost, result: Awaited<ReturnType<typeof publishToInstagram>>) {
  if (result.status === "posted") {
    post.status = "posted";
    post.publishedAt = new Date();
    post.failureReason = "";
  } else if (result.status === "processing") {
    post.status = "processing";
    post.metaContainerId = result.containerId;
    post.metaInstagramId = result.instagramId;
  } else {
    post.status = "failed";
    post.failureReason = result.reason;
  }
  await post.save();
}

/** Finds every post that is due to be published: overdue scheduled posts and stuck "processing" posts. */
export async function findDuePosts() {
  const now = new Date();
  const scheduled = await Post.find({ status: "scheduled", scheduledAt: { $lte: now } });
  const stuckProcessing = await Post.find({ status: "processing" });
  return { scheduled, stuckProcessing };
}
