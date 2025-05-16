import { ProfileModel } from "../../db/profile";
import { UserModel } from "../../db/users"; // adjust path as needed

const getUserProfileByUsername = async (username: string) => {
  // Find the user by username
  const user = await UserModel.findOne({ username });

  if (!user) {
    return null; // or throw an error
  }

  // Find the profile linked to this user ID
  const profile = await ProfileModel.findOne({ user: user._id }).populate("user", "-authentication"); // exclude sensitive fields

  return profile;
};

export default getUserProfileByUsername;
