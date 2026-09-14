import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireUserId } from "@/lib/api/session";
import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import * as meta from "@/lib/meta";
import { POST as setAccess } from "@/app/api/projects/[id]/set_access/route";

vi.mock("@/lib/api/session", () => ({ requireUserId: vi.fn() }));
vi.mock("@/lib/meta", async () => {
  const actual = await vi.importActual<typeof import("@/lib/meta")>("@/lib/meta");
  return { ...actual, exchangeForLongLivedToken: vi.fn(), verifyInstagramConnection: vi.fn() };
});

const asUser = (id: string) => vi.mocked(requireUserId).mockResolvedValue(id);

function req(body: unknown) {
  return new Request("http://test/api/projects/x/set_access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function createProject(userId: string) {
  await connectDB();
  const project = await Project.create({ userId, title: "P" });
  return project._id.toString();
}

describe("POST /api/projects/[id]/set_access", () => {
  beforeEach(() => {
    vi.mocked(requireUserId).mockReset();
    vi.mocked(meta.exchangeForLongLivedToken).mockReset().mockResolvedValue("long-lived-token");
    vi.mocked(meta.verifyInstagramConnection).mockReset();
  });

  it("refuses to connect a token that can't publish, and leaves the project disconnected", async () => {
    const projectId = await createProject("user-a");
    vi.mocked(meta.verifyInstagramConnection).mockRejectedValue(
      new meta.MetaPublishError("Facebook didn't grant these permissions: instagram_content_publish.")
    );

    asUser("user-a");
    const res = await setAccess(req({ token: "short-token", connection: "facebook" }), { params: { id: projectId } });

    expect(res.status).toBe(422);
    expect((await res.json()).message).toMatch(/instagram_content_publish/);
    const project = await Project.findById(projectId);
    expect(project!.connections.facebook.isEnabled).toBe(false);
    expect(project!.connections.facebook.token).toBe("");
  });

  it("saves the long-lived token once the connection is verified", async () => {
    const projectId = await createProject("user-a");
    vi.mocked(meta.verifyInstagramConnection).mockResolvedValue({ pageId: "page-1", pageName: "Brand", instagramId: "ig-1" });

    asUser("user-a");
    const res = await setAccess(req({ token: "short-token", connection: "facebook" }), { params: { id: projectId } });

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: "success", pageName: "Brand" });
    expect(meta.verifyInstagramConnection).toHaveBeenCalledWith("long-lived-token");
    const project = await Project.findById(projectId);
    expect(project!.connections.facebook).toMatchObject({ isEnabled: true, token: "long-lived-token" });
  });

  it("doesn't let a user connect Instagram to someone else's project", async () => {
    const projectId = await createProject("user-a");

    asUser("user-b");
    const res = await setAccess(req({ token: "short-token", connection: "facebook" }), { params: { id: projectId } });

    expect(res.status).toBe(403);
    expect(meta.verifyInstagramConnection).not.toHaveBeenCalled();
  });
});
