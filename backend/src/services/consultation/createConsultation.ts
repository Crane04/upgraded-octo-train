import mongoose from "mongoose";
import { ConsultationModel } from "../../db/consultation";
import getUserByUsername from "../users/getUserByUsername";
import consultDoctor from "../../AI/consultation";
import getDoctorBySessionToken from "../doctors/getDoctorBySessionToken";

class CreateConsultation {
  private static async execute(
    conversation: string,
    patient: mongoose.Types.ObjectId,
    doctor: mongoose.Types.ObjectId
  ) {
    try {
      if (!conversation) {
        throw new Error("Conversation cannot be empty");
      }
      const consultation = new ConsultationModel({
        conversation,
        patient,
        doctor,
      });
      await consultation.save();
      return consultation;
    } catch (error) {
      throw error;
    }
  }

  public static async run(
    conversation: string,
    patient: string,
    sessionToken: string
  ): Promise<any> {
    try {
      if (!conversation) {
        throw new Error("Conversation cannot be empty");
      }
      const user = await getUserByUsername(patient);
      if (!user) {
        throw new Error(`User not found with ID ${patient}`);
      }
      const doctor = await getDoctorBySessionToken(sessionToken);
      if (!doctor) {
        throw new Error(`Doctor not found`);
      }
      try {
        const convertedConversation = await consultDoctor(conversation);
        return await CreateConsultation.execute(
          convertedConversation,
          user._id as mongoose.Types.ObjectId,
          doctor._id as mongoose.Types.ObjectId
        );
      } catch (error) {
        throw new Error(`Failed to convert conversation: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default CreateConsultation;
