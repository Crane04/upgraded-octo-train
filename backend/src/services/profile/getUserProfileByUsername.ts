import { ProfileModel } from "../../db/profile";
import { UserModel } from "../../db/users";

const getUserProfileByQuery = async (query: string) => {
  // Try to find the user by username, email, or fullname
  const user = await UserModel.findOne({
    $or: [
      { username: query },
      { email: query },
      { fullname: query }, // Ensure "fullname" exists in your User schema
    ],
  });

  if (!user) {
    return null;
  }

  // Find the profile associated with this user
  const profile = await ProfileModel.findOne({ user: user._id }).populate("user");

  return profile;
};

export default getUserProfileByQuery;
