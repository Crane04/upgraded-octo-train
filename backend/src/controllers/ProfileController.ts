import updateUserProfile from "../services/profile/updateProfile";
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";

class ProfileController {
  static updateUserProfile = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const body = req.body;

    const profile = updateUserProfile({ sessionToken, ...body });

    return ApiResponse.success(res, "User Profile updated successfully", {});
  };

  static updateUserProfileByHospital = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { username } = req.params;
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const body = req.body;

    const profile: any | { error: string } = await updateUserProfile({
      username,
      hospital: sessionToken,
      ...body,
    });
    if (profile.error) {
      return ApiResponse.error(res, profile.error, 400);
    }
    return ApiResponse.success(
      res,
      "User Profile updated successfully",
      profile
    );
  };
}

export default ProfileController;
