import type { PostStatus } from "@/lib/db/models/post";

export type { PostStatus };

export interface UserDTO {
  username?: string;
  email: string;
  profilePic: string;
  bio: string;
  verified: boolean;
  createdAt: string;
}

export interface ProjectDTO {
  id: string;
  title: string;
  description: string;
  captionLimit: number;
  postLimit: number;
  hashtags: boolean;
  createdAt: string;
  connections: {
    facebook: boolean;
  };
}

export interface PostDTO {
  id: string;
  projectId: string;
  image: string;
  caption: string;
  hashtags: string;
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  failureReason: string;
  createdAt: string;
}

export interface AnalyticsDTO {
  totalProjects: number;
  totalPosts: number;
  byStatus: Record<PostStatus, number>;
  postsPerWeek: { week: string; count: number }[];
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  captionLimit?: number;
  postLimit?: number;
  hashtags?: boolean;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  captionLimit?: number;
  postLimit?: number;
  hashtags?: boolean;
  connections?: { facebook?: boolean };
}

export interface CreatePostInput {
  projectId: string;
  image: string;
  caption?: string;
  hashtags?: string;
  scheduledAt?: string;
}

export type ApiResult<T> = { status: "success"; data: T } | { status: "error"; message: string };
