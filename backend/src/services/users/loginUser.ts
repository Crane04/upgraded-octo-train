import getUserByEmail from "./getUserByEmail";
import { authentication, random } from "../../helpers";
import { User } from "../../db/users";
import GetUserPack from "../pack/getPackByUser";

class LoginUser {
  static run = async (
    email: string,
    password: string
  ): Promise<boolean | User> => {
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return false;
    }
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return false;
    }

    const newSessionToken = authentication(random(), user._id.toString());

    user.authentication.sessionToken = newSessionToken;

    await user.save();

    const safeUser = await getUserByEmail(email).select(
      "+authentication.sessionToken"
    );

    // const userPack = await GetUserPack.getById(user._id.toString());

    return safeUser;
  };
}

export default LoginUser;
