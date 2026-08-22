import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";
import { toProjectDTO, toPostDTO } from "@/lib/api/serializers";

beforeAll(async () => {
  await connectDB();
});

describe("toProjectDTO", () => {
  it("never exposes the Facebook access token", async () => {
    const project = await Project.create({
      userId: "user-1",
      title: "Test Project",
      connections: { facebook: { isEnabled: true, token: "super-secret-token" } },
    });

    const dto = toProjectDTO(project);

    expect(JSON.stringify(dto)).not.toContain("super-secret-token");
    expect(dto.connections.facebook).toBe(true);
    expect(dto.id).toBe(project._id.toString());
    expect(dto.title).toBe("Test Project");
  });

  it("lets the caller override the computed facebook connection status", async () => {
    const project = await Project.create({
      userId: "user-1",
      title: "Another Project",
      connections: { facebook: { isEnabled: true, token: "t" } },
    });

    const dto = toProjectDTO(project, false);
    expect(dto.connections.facebook).toBe(false);
  });
});

describe("toPostDTO", () => {
  it("serializes dates as ISO strings and ids as plain strings", async () => {
    const post = await Post.create({
      projectId: "proj-1",
      userId: "user-1",
      image: "https://example.com/a.jpg",
      status: "posted",
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const dto = toPostDTO(post);

    expect(typeof dto.id).toBe("string");
    expect(dto.publishedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(dto.scheduledAt).toBeNull();
    expect(dto.status).toBe("posted");
  });
});
