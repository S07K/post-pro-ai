import { Schema, model, models, type Document } from "mongoose";

export const POST_STATUSES = ["draft", "scheduled", "processing", "posted", "failed"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export interface IPost extends Document {
  projectId: string;
  userId: string;
  image: string;
  caption: string;
  hashtags: string;
  status: PostStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  failureReason: string;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  projectId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  image: { type: String, required: true },
  caption: { type: String, required: false, default: "" },
  hashtags: { type: String, required: false, default: "" },
  status: { type: String, enum: POST_STATUSES, default: "draft" },
  scheduledAt: { type: Date, default: null },
  publishedAt: { type: Date, default: null },
  failureReason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Post = models.Post || model<IPost>("Post", postSchema);
export default Post;
