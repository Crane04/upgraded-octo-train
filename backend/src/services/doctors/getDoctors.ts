import { DoctorModel } from "../../db/doctors";
import getHospitalBySessionToken from "../hospitals/getHospitalBySessionToken";

const getDoctors = async (hospitalSessionToken: string) => {
  const hospital = await getHospitalBySessionToken(hospitalSessionToken);

  if (!hospital) {
    throw new Error("Hospital not found or unauthenticated");
  }

  const doctors = await DoctorModel.find({ hospital: hospital._id }).select(
    "-authentication.salt -authentication.password"
  );

  return doctors;
};

export default getDoctors;
