import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateHospital from "../services/hospitals/createHospital";
import LoginHospital from "../services/hospitals/loginHospital";
import { get } from "lodash";
import getUserProfileByUsername from "../services/profile/getUserProfileByUsername";
import CreateDoctor from "../services/hospitals/createDoctor";
import getHospitalBySessionToken from "../services/hospitals/getHospitalBySessionToken";
import getDoctors from "../services/doctors/getDoctors";
import sendEmail from "../utils/mail";
import verifyingMail from "../utils/verifyingMail";
import getHospitalByEmail from "../services/hospitals/getHospitalByEmail";
import verifiedMail from "../utils/verifiedMail";

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
    await sendEmail(
      email,
      "Account Verification Update",
      "Your hospital's account is being verified",
      verifyingMail
    );
    ApiResponse.success(res, "Hospital created successfully!", Hospital);
  };

  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const hospital = await LoginHospital.run(email, password);

    if (typeof hospital === "object" && hospital !== null) {
      if (!hospital.verified) {
        ApiResponse.error(res, "Hospital is not verified yet!", 401);
        return;
      }
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

      const {
        fullName,
        username,
        email,
        password,
        gender,
        speciality,
        bio,
        dateOfBirth,
        phoneNumber,
      } = req.body;

      const doctor = await CreateDoctor.run(
        fullName,
        username,
        email,
        hospital?._id.toString(),
        password,
        gender,
        phoneNumber,
        speciality,
        bio,
        dateOfBirth
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

  static verifyHospital = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    const hospital = await getHospitalByEmail(email);

    hospital.verified = true;

    await hospital.save();

    sendEmail(
      email,
      "Account Verified",
      "Your hospital's account has been verified",
      verifiedMail
    );

    return ApiResponse.success(
      res,
      "Your hospital has been verified successfully!",
      hospital
    );
  };
}

export default Hospital;
