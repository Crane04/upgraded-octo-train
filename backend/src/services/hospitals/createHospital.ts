import { HospitalModel, Hospital } from "../../db/hospitals";
import { random, authentication } from "../../helpers";

class CreateHospital {
  private static async execute(
    values: Omit<Hospital, "authentication"> & {
      authentication: {
        salt: string;
        password: string;
      };
    }
  ): Promise<Hospital> {
    const Hospital = await new HospitalModel(values).save();
    return Hospital.toObject();
  }

  public static async run(
    email: string,
    name: string,
    password: string,
    type: string,
    address: string
  ): Promise<Hospital> {
    const salt = random();

    return this.execute({
      email,
      name,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      type,
      address,
    });
  }
}

export default CreateHospital;
