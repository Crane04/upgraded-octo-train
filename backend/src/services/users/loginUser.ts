import getUserByEmail from "./getUserByEmail";
import { authentication, random } from "../../helpers";
import { User } from "../../db/users";

class LoginUser {
  static run = async (
    email: string,
    password: string
  ): Promise<boolean | User> => {
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    console.log(user);
    if (!user) {
      return false;
    }
    const expectedHash = authentication(user.authentication.salt, password);
    console.log(expectedHash);
    if (user.authentication.password !== expectedHash) {
      return false;
    }
    const safeUser = await getUserByEmail(email).select(
      "+authentication.sessionToken"
    );

    return safeUser;
  };
}

export default LoginUser;
