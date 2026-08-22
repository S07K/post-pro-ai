import { Schema, model, models, type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  profilePic: string;
  bio: string;
  verified: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  profilePic: { type: String, required: false, default: "" },
  bio: { type: String, required: false, default: "" },
  verified: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>("User", userSchema);
export default User;
