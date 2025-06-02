import mongoose, { Document } from "mongoose";

export type Doctor = {
  fullName: string;
  username: string;
  email: string;
  hospital: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  gender: "Male" | "Female";
  speciality: string;
  phoneNumber: number;
  bio?: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
};

const DoctorSchema = new mongoose.Schema<Doctor & Document>({
  fullName: {
    type: String,
    required: true,
  },
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
  dateOfBirth: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  speciality: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const DoctorModel = mongoose.model("Doctor", DoctorSchema);
