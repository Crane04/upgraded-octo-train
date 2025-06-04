import { Request, Response } from "express";
import LoginDoctor from "../services/doctors/login";
import ApiResponse from "../helpers/ApiResponse";
import CreateConsultation from "../services/consultation/createConsultation";
import GetConsultations from "../services/consultation/getConsultations";
import CreateUser from "../services/users/createUser";

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

  static getConsultations = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const { username } = req.query;

    const consultations = await GetConsultations.get(
      sessionToken,
      typeof username === "string" ? username : undefined
    );
    ApiResponse.success(
      res,
      "Consultation fetched successfully",
      consultations
    );
  };

  static createPatient = async (req: Request, res: Response): Promise<any> => {
    const { email, username, fullname } = req.body;
    const password = "123456";
    const user = await CreateUser.run(email, username, password, fullname);
    if (!user) {
      ApiResponse.error(res, "Couldn't create account, try again", 400);
      return;
    }
    ApiResponse.success(res, "User created successfully!", user);
  };
}

export default DoctorController;
