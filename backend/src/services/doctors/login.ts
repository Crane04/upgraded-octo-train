import { DoctorModel, Doctor } from "../../db/doctors";
import { authentication, random } from "../../helpers";
import getDoctorByEmail from "./getDoctorByEmail";

class LoginDoctor {
  static run = async (
    email: string,
    password: string
  ): Promise<false | Doctor> => {
   
    const doctor = await getDoctorByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!doctor) return false;

    const expectedHash = authentication(doctor.authentication.salt!, password);

    if (doctor.authentication.password !== expectedHash) {
      return false;
    }

    const newSessionToken = authentication(random(), doctor._id.toString());

    doctor.authentication.sessionToken = newSessionToken;

    await doctor.save();

    // Fetch the safe version (without password/salt)
    const safeDoctor = await getDoctorByEmail(email).select(
      "+authentication.sessionToken"
    );

    return safeDoctor;
  };
}

export default LoginDoctor;
