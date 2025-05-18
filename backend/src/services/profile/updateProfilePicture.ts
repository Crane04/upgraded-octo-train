import { ProfileModel } from "../../db/profile";
import { User, UserModel } from "../../db/users";

interface UpdateProfileInput {
  image: string;
  sessionToken: string;
}

const updateProfilePicture = async (input: UpdateProfileInput) => {
  const user = await UserModel.findOne({
    "authentication.sessionToken": input.sessionToken,
  });

  if (!user) {
    return { error: "User doesnnt exist!" };
  }
  const profile = await ProfileModel.findOne({
    user: user._id,
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  profile.image = input.image;

  await profile.save();
  return profile;
};

export default updateProfilePicture;
