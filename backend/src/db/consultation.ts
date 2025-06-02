import mongoose, { Document } from "mongoose";

export type Consultation = {
  conversation: string;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
};

const consultationSchema = new mongoose.Schema<Consultation & Document>(
  {
    conversation: {
      type: String,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  { timestamps: true }
);

export const ConsultationModel = mongoose.model(
  "Consultation",
  consultationSchema
);
