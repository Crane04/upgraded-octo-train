import { Request, Response } from "express";
import LoginDoctor from "../services/doctors/login";
import ApiResponse from "../helpers/ApiResponse";

class DoctorController {
  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const doctor = await LoginDoctor.run(email, password);

    if (typeof doctor === "object" && doctor !== null) {
      res.cookie("sessionToken", doctor.authentication.sessionToken);

      ApiResponse.success(res, "Doctor logged in successfully", doctor);
      return;
    }

    ApiResponse.error(res, "Invalid Credentials", 400);
  };
}

export default DoctorController;
