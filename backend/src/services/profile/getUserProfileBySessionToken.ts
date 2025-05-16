import { ProfileModel } from "../../db/profile";
import { UserModel } from "../../db/users"; // adjust path as needed

const getUserProfileBySessionToken = async (sessionToken: string) => {
  // Find the user by username

  const user = await UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });

  if (!user) {
    return null; // or throw an error
  }

  // Find the profile linked to this user ID
  const profile = await ProfileModel.findOne({ user: user._id }).populate(
    "user"
  );

  return profile;
};

export default getUserProfileBySessionToken;
