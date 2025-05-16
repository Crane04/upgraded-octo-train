import { UserModel } from "../../db/users";
const getUserByEmail = (email: string) => UserModel.findOne({ email });

export default getUserByEmail;
