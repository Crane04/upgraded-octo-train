import { UserModel } from "../../db/users";

const getUsers = () => {
  return UserModel.find();
};

export default getUsers;
