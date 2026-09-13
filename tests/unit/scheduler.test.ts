import { describe, it, expect, vi, beforeEach } from "vitest";
import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";
import { publishPost, resumeProcessingPost } from "@/lib/scheduler";
import * as meta from "@/lib/meta";

vi.mock("@/lib/meta", async () => {
  const actual = await vi.importActual<typeof import("@/lib/meta")>("@/lib/meta");
  return { ...actual, publishToInstagram: vi.fn(), finishPendingPublish: vi.fn() };
});

beforeEach(async () => {
  await connectDB();
  vi.mocked(meta.publishToInstagram).mockReset();
  vi.mocked(meta.finishPendingPublish).mockReset();
});

describe("publishPost", () => {
  it("fails immediately if the project has no Instagram connection", async () => {
    const project = await Project.create({ userId: "u1", title: "P" });
    const post = await Post.create({ projectId: project._id.toString(), userId: "u1", image: "https://x/y.jpg" });

    await publishPost(post, project);

    const reloaded = await Post.findById(post._id);
    expect(reloaded!.status).toBe("failed");
    expect(reloaded!.failureReason).toMatch(/not connected/i);
    expect(meta.publishToInstagram).not.toHaveBeenCalled();
  });

  it("marks the post posted when the publish succeeds", async () => {
    const project = await Project.create({
      userId: "u1",
      title: "P",
      connections: { facebook: { isEnabled: true, token: "tok" } },
    });
    const post = await Post.create({ projectId: project._id.toString(), userId: "u1", image: "https://x/y.jpg" });
    vi.mocked(meta.publishToInstagram).mockResolvedValue({ status: "posted" });

    await publishPost(post, project);

    const reloaded = await Post.findById(post._id);
    expect(reloaded!.status).toBe("posted");
    expect(reloaded!.publishedAt).not.toBeNull();
  });

  it("leaves the post in 'processing' and stores the container/instagram ids when publish times out", async () => {
    const project = await Project.create({
      userId: "u1",
      title: "P",
      connections: { facebook: { isEnabled: true, token: "tok" } },
    });
    const post = await Post.create({ projectId: project._id.toString(), userId: "u1", image: "https://x/y.jpg" });
    vi.mocked(meta.publishToInstagram).mockResolvedValue({ status: "processing", containerId: "c1", instagramId: "ig1", token: "tok" });

    await publishPost(post, project);

    const reloaded = await Post.findById(post._id);
    expect(reloaded!.status).toBe("processing");
    expect(reloaded!.metaContainerId).toBe("c1");
    expect(reloaded!.metaInstagramId).toBe("ig1");
  });
});

describe("resumeProcessingPost", () => {
  it("fails a stuck post that has no stored container reference", async () => {
    const post = await Post.create({ projectId: "p1", userId: "u1", image: "https://x/y.jpg", status: "processing" });

    await resumeProcessingPost(post);

    const reloaded = await Post.findById(post._id);
    expect(reloaded!.status).toBe("failed");
  });

  it("finishes a stuck post once Instagram reports it's done", async () => {
    const project = await Project.create({
      userId: "u1",
      title: "P",
      connections: { facebook: { isEnabled: true, token: "tok" } },
    });
    const post = await Post.create({
      projectId: project._id.toString(),
      userId: "u1",
      image: "https://x/y.jpg",
      status: "processing",
      metaContainerId: "c1",
      metaInstagramId: "ig1",
    });
    vi.mocked(meta.finishPendingPublish).mockResolvedValue({ status: "posted" });

    await resumeProcessingPost(post);

    const reloaded = await Post.findById(post._id);
    expect(reloaded!.status).toBe("posted");
  });
});
