import mongoose, { Document, Schema } from "mongoose";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  name: String,
  email: {
    type: String,
    required: true, // Use 'required' instead of 'require'
    unique: true,
  },
  password: {
    type: String,
  },
  gid: {
    type: String,
  },
});

export const userModel = mongoose.model<IUserModel>("User", userSchema);
