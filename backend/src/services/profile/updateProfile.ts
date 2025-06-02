import getHospitalBySessionToken from "../../services/hospitals/getHospitalBySessionToken";
import { ProfileModel } from "../../db/profile";
import { User, UserModel } from "../../db/users";
import { Types } from "mongoose";
import getSessionToken from "../../services/general/getSessionToken";
import { Hospital } from "../../db/hospitals";
import { Doctor } from "../../db/doctors";

interface UpdateProfileInput {
  sessionToken: string | Types.ObjectId;
  username: string;
  address?: string;
  gender?: "Male" | "Female" | "Other";
  genotype?: string;
  bloodGroup?: string;
  disability?: string | null;
  phoneNumber?: string;
  dateOfBirth?: Date;
  previousHospital?: string;
  additionalNote?: string;
  hospital?: string;
  allergy?: string;
  newHistory: string;
}

const updateUserProfile = async (input: UpdateProfileInput) => {
  let user;

  if (input.sessionToken) {
    user = await UserModel.findOne({
      "authentication.sessionToken": input.sessionToken,
    });
  } else if (input.username) {
    user = await UserModel.findOne({
      username: input.username,
    });
  }
  if (!user) {
    return { error: "User doesnnt exist!" };
  }
  const profile = await ProfileModel.findOne({
    user: user._id,
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Update standard fields if provided
  if (input.address) profile.address = input.address;
  if (input.gender) profile.gender = input.gender;
  if (input.genotype) profile.genotype = input.genotype;
  if (input.bloodGroup) profile.bloodGroup = input.bloodGroup;
  if (input.disability !== undefined) profile.disability = input.disability;
  if (input.phoneNumber) profile.phoneNumber = input.phoneNumber;
  if (input.dateOfBirth) profile.dateOfBirth = input.dateOfBirth;

  // Append to additionalNotes if a new note is provided
  if (input.additionalNote) {
    profile.additionalNotes.push({
      note: input.additionalNote,
      date: new Date(),
    });
  }

  if (input.allergy) {
    profile.allergies.push({
      allergy: input.allergy,
      date: new Date(),
    });
  }

  if (input.newHistory) {
    profile.medicalHistory.push({
      history: input.newHistory,
      date: new Date(),
    });
  }

  if (input.hospital) {
    const user = await getSessionToken(input.hospital);
    console.log(user);
    if (user) {
      if (user.type === "hospital") {
        console.log("na hospital");
        const hospital = user.user as Hospital;
        profile.previousHospitals.push({
          hospitalName: hospital.name,
          dateVisited: new Date(),
        });
      } else if (user.type === "doctor") {
        console.log("na doctor");
        const hospitalName = user.hospitalName;
        const doctor = user.user as Doctor;
        profile.previousHospitals.push({
          hospitalName,
          doctor: doctor.fullName,
          dateVisited: new Date(),
        });
      }
    }
  }

  await profile.save();
  return profile;
};

export default updateUserProfile;
