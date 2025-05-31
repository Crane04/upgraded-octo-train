import { DoctorModel } from "../../db/doctors";

const getDoctorByEmail = (email: string) => DoctorModel.findOne({ email });

export default getDoctorByEmail;
