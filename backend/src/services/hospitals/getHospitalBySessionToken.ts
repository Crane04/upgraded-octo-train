import { HospitalModel } from "../../db/hospitals";

const getHospitalBySessionToken = (sessionToken: string) =>
  HospitalModel.findOne({ "authentication.sessionToken": sessionToken });

export default getHospitalBySessionToken;
