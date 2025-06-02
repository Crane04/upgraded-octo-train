import getDoctorBySessionToken from "../doctors/getDoctorBySessionToken";
import getHospitalBySessionToken from "../hospitals/getHospitalBySessionToken";
import getHospitalById from "../hospitals/getHospitalById";

const getSessionToken = async (sessionToken: string) => {
  const hospital = await getHospitalBySessionToken(sessionToken);
  if (hospital) {
    return { type: "hospital", user: hospital };
  }
  const doctor = await getDoctorBySessionToken(sessionToken);
  if (doctor) {
    const hospital = await getHospitalById(doctor.hospital.toString());
    return { type: "doctor", user: doctor, hospitalName: hospital.name };
  }
  return null;
};

export default getSessionToken;
