import { UserModel, User } from "../../db/users";
import { random, authentication } from "../../helpers";

class CreateUser {
  private static async execute(
    values: Omit<User, "authentication"> & {
      authentication: {
        salt: string;
        password: string;
      };
    }
  ): Promise<User> {
    const user = await new UserModel(values).save();
    return user.toObject();
  }

  public static async run(
    email: string,
    username: string,
    password: string,
    fullname: string
  ): Promise<User> {
    const salt = random();

    return this.execute({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      fullname,
    });
  }
}

export default CreateUser;
