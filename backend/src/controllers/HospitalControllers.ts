import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateHospital from "../services/hospitals/createHospital";
import LoginHospital from "../services/hospitals/loginHospital";
import { get } from "lodash";
import getUserProfileByUsername from "../services/profile/getUserProfileByUsername";

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
    const Hospital = get(req, "identity"); //passed from middleware

    ApiResponse.success(res, "Hospital retrieved successfully", Hospital);
  };

  static getUserProfile = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.params;

    const user = await getUserProfileByUsername(username);

    console.log(user);

    return ApiResponse.success(
      res,
      "User Profile retrieved successfully",
      user
    );
  };
}

export default Hospital;
