import { DoctorModel } from "../../db/doctors";

const getDoctorBySessionToken = (sessionToken: string) =>
  DoctorModel.findOne({ sessionToken });

export default getDoctorBySessionToken;
