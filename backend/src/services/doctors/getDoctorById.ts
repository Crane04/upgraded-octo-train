import { DoctorModel } from "../../db/doctors";

const getDoctorById = (id: string) => DoctorModel.findById(id);

export default getDoctorById;
