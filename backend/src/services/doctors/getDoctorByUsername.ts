import { DoctorModel } from "../../db/doctors";

const getDoctorByUsername = async (username: string) =>
  DoctorModel.findOne({ username });

export default getDoctorByUsername;
