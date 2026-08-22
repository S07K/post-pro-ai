import type { IProject } from "@/lib/db/models/project";
import type { IPost } from "@/lib/db/models/post";
import type { ProjectDTO, PostDTO } from "@/types";

export function toProjectDTO(project: IProject, facebookConnected?: boolean): ProjectDTO {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    captionLimit: project.captionLimit,
    postLimit: project.postLimit,
    hashtags: project.hashtags,
    createdAt: project.createdAt.toISOString(),
    connections: {
      facebook: facebookConnected ?? project.connections.facebook.isEnabled,
    },
  };
}

export function toPostDTO(post: IPost): PostDTO {
  return {
    id: post._id.toString(),
    projectId: post.projectId,
    image: post.image,
    caption: post.caption,
    hashtags: post.hashtags,
    status: post.status,
    scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    failureReason: post.failureReason,
    createdAt: post.createdAt.toISOString(),
  };
}
