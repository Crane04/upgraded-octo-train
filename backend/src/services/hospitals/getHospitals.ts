import { HospitalModel } from "../../db/hospitals";

const getHospitals = () => {
  return HospitalModel.find();
};

export default getHospitals;
