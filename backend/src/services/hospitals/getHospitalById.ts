import { HospitalModel } from "../../db/hospitals";

const getHospitalById = (id: string) => HospitalModel.findById(id);

export default getHospitalById;
