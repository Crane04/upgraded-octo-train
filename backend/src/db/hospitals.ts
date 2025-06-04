import mongoose from "mongoose";

export type Hospital = {
  name: string;
  email: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
  type: string;
  address: string;
  verified?: boolean;
};

const HospitalSchema = new mongoose.Schema<Hospital>({
  name: {
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
  type: {
    type: String,
    required: true,
  },
  address: { type: String, required: true },
  verified: { type: Boolean, required: false },
});

export const HospitalModel = mongoose.model("Hospital", HospitalSchema);
