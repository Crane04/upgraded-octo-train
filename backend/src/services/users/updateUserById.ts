import { UserModel } from "../../db/users";

const updateUserById = (id: string, values: Record<string, any>) => {
  UserModel.findByIdAndUpdate(id, values, { new: true });
};

export default updateUserById;
