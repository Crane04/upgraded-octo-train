import { ProfileModel } from "../../db/profile";

const getAllProfiles = async () => {
  // Find the profile linked to this user ID
  const profile = await ProfileModel.find().populate("user"); // exclude sensitive fields

  return profile;
};

export default getAllProfiles;
