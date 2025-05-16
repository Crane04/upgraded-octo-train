import getHospitalByEmail from "./getHospitalByEmail";
import { authentication, random } from "../../helpers";
import { Hospital } from "../../db/hospitals";

class LoginHospital {
  static run = async (
    email: string,
    password: string
  ): Promise<boolean | Hospital> => {
    const hospital = await getHospitalByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!hospital) {
      return false;
    }
    const expectedHash = authentication(hospital.authentication.salt, password);

    if (hospital.authentication.password !== expectedHash) {
      return false;
    }

    const newSessionToken = authentication(random(), hospital._id.toString());

    hospital.authentication.sessionToken = newSessionToken;

    await hospital.save();
    
    const safeHospital = await getHospitalByEmail(email).select(
      "+authentication.sessionToken"
    );
    console.log(safeHospital);
    return safeHospital;
  };
}

export default LoginHospital;
