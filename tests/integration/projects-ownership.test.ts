import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireUserId } from "@/lib/api/session";
import { GET as listProjects, POST as createProject } from "@/app/api/projects/route";
import { GET as getProject, PUT as updateProject, DELETE as deleteProject } from "@/app/api/projects/[id]/route";

vi.mock("@/lib/api/session", () => ({ requireUserId: vi.fn() }));

const asUser = (id: string) => vi.mocked(requireUserId).mockResolvedValue(id);

function req(method: string, body?: unknown) {
  return new Request("http://test/api/projects", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function createProjectAs(userId: string, title: string) {
  asUser(userId);
  const res = await createProject(req("POST", { title }));
  const body = await res.json();
  return body.project.id as string;
}

describe("project ownership scoping", () => {
  beforeEach(() => {
    vi.mocked(requireUserId).mockReset();
  });

  it("returns 401 when there is no session", async () => {
    vi.mocked(requireUserId).mockResolvedValue(null);
    const res = await createProject(req("POST", { title: "x" }));
    expect(res.status).toBe(401);
  });

  it("a user cannot GET, PUT, or DELETE another user's project (the IDOR that existed on the old backend)", async () => {
    const projectId = await createProjectAs("user-a", "Alice's Project");

    asUser("user-b");
    const getRes = await getProject(new Request("http://test"), { params: { id: projectId } });
    expect(getRes.status).toBe(403);

    const putRes = await updateProject(req("PUT", { title: "Hijacked" }), { params: { id: projectId } });
    expect(putRes.status).toBe(403);

    const deleteRes = await deleteProject(new Request("http://test", { method: "DELETE" }), { params: { id: projectId } });
    expect(deleteRes.status).toBe(403);
  });

  it("the owner can read and update their own project", async () => {
    const projectId = await createProjectAs("user-a", "Alice's Project");

    asUser("user-a");
    const getRes = await getProject(new Request("http://test"), { params: { id: projectId } });
    expect(getRes.status).toBe(200);

    const putRes = await updateProject(req("PUT", { title: "Renamed" }), { params: { id: projectId } });
    expect(putRes.status).toBe(200);
    const putBody = await putRes.json();
    expect(putBody.project.title).toBe("Renamed");
  });

  it("returns 404 (not 500) for a project id that doesn't exist", async () => {
    asUser("user-a");
    const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa"; // valid-shaped ObjectId that doesn't exist
    const res = await getProject(new Request("http://test"), { params: { id: fakeId } });
    expect(res.status).toBe(404);
  });

  it("scopes the projects list to the authenticated user only", async () => {
    await createProjectAs("user-a", "A1");
    await createProjectAs("user-a", "A2");
    await createProjectAs("user-b", "B1");

    asUser("user-a");
    const res = await listProjects();
    const body = await res.json();
    expect(body.projects).toHaveLength(2);
    expect(body.projects.every((p: { title: string }) => p.title.startsWith("A"))).toBe(true);
  });
});
