import { DoctorModel } from "../../db/doctors";

const getDoctorBySessionToken = async (sessionToken: string) =>
  await DoctorModel.findOne({ "authentication.sessionToken": sessionToken });

export default getDoctorBySessionToken;
