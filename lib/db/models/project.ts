import { Schema, model, models, type Document } from "mongoose";

interface IFacebookConnection {
  isEnabled: boolean;
  token: string;
}

export interface IProject extends Document {
  userId: string;
  title: string;
  description: string;
  captionLimit: number;
  postLimit: number;
  hashtags: boolean;
  createdAt: Date;
  connections: {
    facebook: IFacebookConnection;
  };
}

const projectSchema = new Schema<IProject>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  captionLimit: { type: Number, required: false, default: 100 },
  postLimit: { type: Number, required: false, default: 10 },
  hashtags: { type: Boolean, required: false, default: true },
  createdAt: { type: Date, default: Date.now },
  connections: {
    facebook: {
      isEnabled: { type: Boolean, default: false },
      token: { type: String, default: "" },
    },
  },
});

const Project = models.Project || model<IProject>("Project", projectSchema);
export default Project;
