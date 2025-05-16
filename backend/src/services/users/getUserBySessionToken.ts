import { UserModel } from "../../db/users";

const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export default getUserBySessionToken;
