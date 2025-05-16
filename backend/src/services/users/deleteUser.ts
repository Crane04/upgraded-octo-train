import { UserModel } from "../../db/users";

const deleteUser = (id: string) => {
  UserModel.findOneAndDelete({ _id: id });
};

export default deleteUser;
