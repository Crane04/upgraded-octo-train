import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateHospital from "../services/hospitals/createHospital";
import LoginHospital from "../services/hospitals/loginHospital";
import { get } from "lodash";
import getUserProfileByUsername from "../services/profile/getUserProfileByUsername";
import CreateDoctor from "../services/hospitals/createDoctor";
import getHospitalBySessionToken from "../services/hospitals/getHospitalBySessionToken";
import getDoctors from "../services/doctors/getDoctors";

class Hospital {
  static register = async (req: Request, res: Response): Promise<any> => {
    const { email, password, name, type, address } = req.body;

    const Hospital = await CreateHospital.run(
      email,
      name,
      password,
      type,
      address
    );
    if (!Hospital) {
      ApiResponse.error(res, "Couldn't create account, try again", 400);
      return;
    }
    ApiResponse.success(res, "Hospital created successfully!", Hospital);
  };

  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const hospital = await LoginHospital.run(email, password);

    if (typeof hospital === "object" && hospital !== null) {
      res.cookie("sessionToken", hospital.authentication.sessionToken);
      ApiResponse.success(res, "Hospital logged in successfully", hospital);
      return;
    }

    ApiResponse.error(res, "Invalid Credentials", 400);
  };

  static getHospital = async (req: Request, res: Response): Promise<any> => {
    const hospital = get(req, "identity"); //passed from middleware

    ApiResponse.success(res, "Hospital retrieved successfully", hospital);
  };

  static getUserProfile = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.params;

    const user = await getUserProfileByUsername(username);

    return ApiResponse.success(
      res,
      "User Profile retrieved successfully",
      user
    );
  };

  static createDoctor = async (req: Request, res: Response): Promise<any> => {
    try {
      const sessionToken =
        req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

      const hospital = await getHospitalBySessionToken(sessionToken);

      if (!hospital || !hospital?._id) {
        return ApiResponse.error(res, "Hospital not authenticated", 401);
      }

      const { fullName, username, email, password } = req.body;

      const doctor = await CreateDoctor.run(
        fullName,
        username,
        email,
        hospital?._id.toString(),
        password
      );

      return ApiResponse.success(res, "Doctor created successfully", doctor);
    } catch (error) {
      console.error(error);
      return ApiResponse.error(res, "Failed to create doctor", 500);
    }
  };

  static getDoctors = async (req: Request, res: Response): Promise<any> => {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const doctors = await getDoctors(sessionToken);

    return ApiResponse.success(res, "Doctors Fetched successfully", doctors);
  };
}

export default Hospital;
