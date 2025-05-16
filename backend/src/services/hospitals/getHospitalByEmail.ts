import { HospitalModel } from "../../db/hospitals";
const getHospitalByEmail = (email: string) => HospitalModel.findOne({ email });

export default getHospitalByEmail;
