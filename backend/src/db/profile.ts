import { Document, Schema, model, Types } from "mongoose";

export interface PreviousHospital {
  hospitalName?: string;
  dateVisited?: Date;
  doctor?: string;
}

export interface AdditionalNote {
  note?: string;
  date?: Date;
}

export interface Allergy {
  allergy: string;
  date: Date;
}

export interface MedicalHistory {
  history: string;
  date: Date;
}

export interface Profile extends Document {
  user?: Types.ObjectId;
  address?: string;
  gender?: "Male" | "Female" | "Other";
  genotype?: string;
  bloodGroup?: string;
  disability?: string | null;
  previousHospitals?: PreviousHospital[];
  phoneNumber?: string;
  dateOfBirth?: Date;
  image?: string | null;
  additionalNotes?: AdditionalNote[];
  allergies?: Allergy[];
  medicalHistory: MedicalHistory[];
}

const ProfileSchema = new Schema<Profile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    genotype: { type: String },
    bloodGroup: { type: String },
    disability: { type: String, default: null },
    previousHospitals: [
      {
        hospitalName: { type: String, required: true },
        doctor: { type: String, required: false },
        dateVisited: { type: Date, default: Date.now },
      },
    ],
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    image: { type: String, default: null },
    additionalNotes: [
      {
        note: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    allergies: [
      {
        allergy: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    medicalHistory: [
      {
        history: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ProfileModel = model<Profile>("Profile", ProfileSchema);
