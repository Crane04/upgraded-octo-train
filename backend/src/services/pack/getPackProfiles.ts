import PackModel from "../../db/packs";
import { ProfileModel } from "../../db/profile";
import { UserModel, User } from "../../db/users"; // Import the User type

class PackProfiles {
  async getMembersWithProfiles(uniqueID: string) {
    const pack = await PackModel.findOne({ uniqueID })
      .populate("members")
      .exec();

    if (!pack) {
      throw new Error("Pack not found");
    }

    const members = pack.members;

    const memberIds = members.map((member) => member._id);

    const profiles = await ProfileModel.find({ user: { $in: memberIds } })
      .populate("user")
      .select(
        "dateOfBirth previousHospitals additionalNotes allergies medicalHistory phoneNumber bloodGroup"
      )
      .exec();

    return profiles;
  }
}

export default PackProfiles;
