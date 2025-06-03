import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import CreateUser from "../services/users/createUser";
import LoginUser from "../services/users/loginUser";
import { get } from "lodash";
import getUserProfileBySessionToken from "../services/profile/getUserProfileBySessionToken";
import getAllProfiles from "../services/profile/getAllProfiles";

class AuthController {
  static register = async (req: Request, res: Response): Promise<any> => {
    const { email, password, username, fullname, location } = req.body;

    const user = await CreateUser.run(
      email,
      username,
      password,
      fullname,
      location
    );
    if (!user) {
      ApiResponse.error(res, "Couldn't create account, try again", 400);
      return;
    }
    ApiResponse.success(res, "User created successfully!", user);
  };

  static login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    const user = await LoginUser.run(email, password);

    if (typeof user === "object" && user !== null) {
      res.cookie("sessionToken", user.authentication.sessionToken);

      ApiResponse.success(res, "User logged in successfully", user);
      return;
    }

    ApiResponse.error(res, "Invalid Credentials", 400);
  };

  static getUser = async (req: Request, res: Response): Promise<any> => {
    const user = get(req, "identity"); //passed from middleware

    ApiResponse.success(res, "User retrieved successfully", user);
  };

  static getUserProfile = async (req: Request, res: Response): Promise<any> => {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const userProfile = await getUserProfileBySessionToken(sessionToken);

    return ApiResponse.success(
      res,
      "User Profile retrieved successfully",
      userProfile
    );
  };

  static getAllUsers = async (req: Request, res: Response): Promise<any> => {
    const users = await getAllProfiles();
    return ApiResponse.success(
      res,
      "All Users Profile retrieved successfully",
      users
    );
  };

  static isUserOnline = async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ isOnline: true });
  };
}

export default AuthController;
