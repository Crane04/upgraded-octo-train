import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateHospital from "../services/hospitals/createHospital";
import LoginHospital from "../services/hospitals/loginHospital";
import { get } from "lodash";

class Hospital {
  static register = async (req: Request, res: Response): Promise<any> => {
    const { email, password, name } = req.body;

    const Hospital = await CreateHospital.run(email, name, password);
    if (!Hospital) {
      ApiResponse.error(res, "Couldn't create account, try again", 400);
      return;
    }
    ApiResponse.success(res, "Hospital created successfully!", Hospital);
  };

  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const Hospital = await LoginHospital.run(email, password);

    if (typeof Hospital === "object" && Hospital !== null) {
      
      ApiResponse.success(res, "Hospital logged in successfully", Hospital);
      return;
    }

    ApiResponse.error(res, "Invalid Credentials", 400);
  };

  static getHospital = async (req: Request, res: Response): Promise<any> => {
    const Hospital = get(req, "identity"); //passed from middleware

    ApiResponse.success(res, "Hospital retrieved successfully", Hospital);
  };
}

export default Hospital;
