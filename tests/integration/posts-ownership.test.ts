import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireUserId } from "@/lib/api/session";
import { POST as createProject } from "@/app/api/projects/route";
import { GET as getPost, PUT as updatePost } from "@/app/api/posts/[id]/route";
import { GET as getProjectPosts } from "@/app/api/posts/project/[projectId]/route";
import Post from "@/lib/db/models/post";

vi.mock("@/lib/api/session", () => ({ requireUserId: vi.fn() }));

const asUser = (id: string) => vi.mocked(requireUserId).mockResolvedValue(id);

async function createProjectAs(userId: string, title: string) {
  asUser(userId);
  const res = await createProject(
    new Request("http://test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) })
  );
  const body = await res.json();
  return body.project.id as string;
}

describe("post ownership scoping", () => {
  beforeEach(() => {
    vi.mocked(requireUserId).mockReset();
  });

  it("a user cannot read or update another user's post", async () => {
    const projectId = await createProjectAs("user-a", "Alice's Project");
    const post = await Post.create({ projectId, userId: "user-a", image: "https://x/y.jpg", caption: "hi" });

    asUser("user-b");
    const getRes = await getPost(new Request("http://test"), { params: { id: post._id.toString() } });
    expect(getRes.status).toBe(403);

    const putRes = await updatePost(
      new Request("http://test", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption: "hijacked" }) }),
      { params: { id: post._id.toString() } }
    );
    expect(putRes.status).toBe(403);
  });

  it("a user cannot list posts for a project they don't own", async () => {
    const projectId = await createProjectAs("user-a", "Alice's Project");
    await Post.create({ projectId, userId: "user-a", image: "https://x/y.jpg" });

    asUser("user-b");
    const res = await getProjectPosts(new Request("http://test"), { params: { projectId } });
    expect(res.status).toBe(403);
  });

  it("the owner can list and update their own posts", async () => {
    const projectId = await createProjectAs("user-a", "Alice's Project");
    const post = await Post.create({ projectId, userId: "user-a", image: "https://x/y.jpg" });

    asUser("user-a");
    const listRes = await getProjectPosts(new Request("http://test"), { params: { projectId } });
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();
    expect(listBody.posts).toHaveLength(1);

    const putRes = await updatePost(
      new Request("http://test", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption: "updated" }) }),
      { params: { id: post._id.toString() } }
    );
    expect(putRes.status).toBe(200);
    const putBody = await putRes.json();
    expect(putBody.post.caption).toBe("updated");
  });
});
