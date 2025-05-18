import updateUserProfile from "../services/profile/updateProfile";
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../helpers/ApiResponse";
import { uploadToCloudinary } from "../utils/cloudinary";
import updateProfilePicture from "../services/profile/updateProfilePicture";

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
  static updateImage = async (req: Request, res: Response) => {
    try {
      const sessionToken =
        req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

      if (!sessionToken) {
        return ApiResponse.error(res, "Unauthenticated", 401);
      }

      if (!req.file) {
        return ApiResponse.error(res, "No image uploaded", 400);
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.path,
        "profileImages"
      );

      // Update profile image
      const updatedProfile = await updateProfilePicture({
        image: uploadResult.url,
        sessionToken,
      });

      return ApiResponse.success(res, "Profile image updated", updatedProfile);
    } catch (error) {
      console.error(error);
      return ApiResponse.error(res, "Something went wrong", 500);
    }
  };
}

export default ProfileController;
