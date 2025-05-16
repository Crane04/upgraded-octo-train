import { UserModel } from "../../db/users";

const getUserById = (id: string) => UserModel.findById(id);

export default getUserById;
