import { DoctorModel, Doctor } from "../../db/doctors";
import { HospitalModel } from "../../db/hospitals";
import { random, authentication } from "../../helpers";

class CreateDoctor {
  private static async execute(
    values: Omit<Doctor, "authentication"> & {
      authentication: {
        salt: string;
        password: string;
      };
    }
  ): Promise<Omit<Doctor, "authentication">> {
    const doctor = await new DoctorModel(values).save();
    const { authentication, ...doctorWithoutAuth } = doctor.toObject();
    return doctorWithoutAuth;
  }

  public static async run(
    fullName: string,
    username: string,
    email: string,
    hospitalId: string,
    password: string = "123456",
    gender: "Male" | "Female",
    phoneNumber: number,
    speciality: string,
    bio: string,
    dateOfBirth: Date
  ): Promise<Omit<Doctor, "authentication">> {
    const hospital = await HospitalModel.findById(hospitalId);
    if (!hospital) {
      throw new Error("Hospital not found");
    }

    const salt = random();
    const hashedPassword = authentication(salt, password);

    return this.execute({
      fullName,
      username,
      email,
      hospital: hospital._id,
      gender,
      phoneNumber,
      speciality,
      bio,
      dateOfBirth,
      authentication: {
        salt,
        password: hashedPassword,
      },
    });
  }
}

export default CreateDoctor;
