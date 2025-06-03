import { ConsultationModel } from "../../db/consultation";
import getDoctorBySessionToken from "../../services/doctors/getDoctorBySessionToken";
import getUserByUsername from "../../services/users/getUserByUsername";

class GetConsultations {
  private static find = async (query: any) => {
    return await ConsultationModel.find(query)
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });
  };

  public static get = async (sessionToken: string, username?: string) => {
    try {
      const doctor = await getDoctorBySessionToken(sessionToken);
      if (!doctor) {
        throw new Error("Doctor not found");
      }

      const query: any = { doctor: doctor._id };

      if (username) {
        const patient = await getUserByUsername(username);
        if (!patient) {
          throw new Error("Patient not found");
        }
        query.patient = patient._id;
      }

      const consultations = await GetConsultations.find(query);

      return consultations;
    } catch (error) {
      throw error;
    }
  };
}

export default GetConsultations;
