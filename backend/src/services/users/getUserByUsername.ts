import { UserModel } from "../../db/users";
const getUserByUsername = (username: string) => UserModel.findOne({ username });

export default getUserByUsername;
