import { Request, Response } from "express";
import LoginDoctor from "../services/doctors/login";
import ApiResponse from "../helpers/ApiResponse";
import CreateConsultation from "../services/consultation/createConsultation";

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

  static consultDoctor = async (req: Request, res: Response): Promise<any> => {
    const { patient, conversation } = req.body;
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const response = await CreateConsultation.run(
      conversation,
      patient,
      sessionToken
    );

    ApiResponse.success(res, "Consultation recorded successfully", response);
  };
}

export default DoctorController;
