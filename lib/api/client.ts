import type {
  ProjectDTO,
  PostDTO,
  AnalyticsDTO,
  CreateProjectInput,
  UpdateProjectInput,
  CreatePostInput,
} from "@/types";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.status === "error") {
    throw new ApiError(body?.message || "Something went wrong", response.status);
  }
  return body as T;
}

// Projects
export const getProjects = () =>
  request<{ status: "success"; projects: ProjectDTO[] }>("/api/projects").then((r) => r.projects);

export const getProject = (id: string) =>
  request<{ status: "success"; project: ProjectDTO }>(`/api/projects/${id}`).then((r) => r.project);

export const createProject = (input: CreateProjectInput) =>
  request<{ status: "success"; project: ProjectDTO }>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((r) => r.project);

export const updateProject = (id: string, input: UpdateProjectInput) =>
  request<{ status: "success"; project: ProjectDTO }>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  }).then((r) => r.project);

export const deleteProject = (id: string) =>
  request<{ status: "success" }>(`/api/projects/${id}`, { method: "DELETE" });

export const setProjectFacebookAccess = (id: string, token: string) =>
  request<{ status: "success"; connection: "facebook" }>(`/api/projects/${id}/set_access`, {
    method: "POST",
    body: JSON.stringify({ token, connection: "facebook" }),
  });

// Posts
export const getProjectPosts = (projectId: string) =>
  request<{ status: "success"; posts: PostDTO[] }>(`/api/posts/project/${projectId}`).then((r) => r.posts);

export const getRecentPosts = (limit = 12) =>
  request<{ status: "success"; posts: PostDTO[] }>(`/api/posts/recent?limit=${limit}`).then((r) => r.posts);

export const createPost = (input: CreatePostInput) =>
  request<{ status: "success"; post: PostDTO }>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((r) => r.post);

export const updatePost = (id: string, input: { caption?: string; hashtags?: string }) =>
  request<{ status: "success"; post: PostDTO }>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  }).then((r) => r.post);

// OpenAI
export const generatePostImage = (prompt: string, projectId: string) =>
  request<{ status: "success"; data: { url: string } }>("/api/openai/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, projectId }),
  }).then((r) => r.data.url);

// Analytics
export const getAnalytics = () =>
  request<{ status: "success"; analytics: AnalyticsDTO }>("/api/analytics").then((r) => r.analytics);

// Auth
export const register = (email: string, password: string) =>
  request<{ status: "success" }>("/api/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
