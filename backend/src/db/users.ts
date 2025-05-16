import mongoose from "mongoose";

export type User = {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
};


const UserSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);




