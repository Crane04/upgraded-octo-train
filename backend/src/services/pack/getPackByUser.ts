import PackModel from "../../db/packs";
import getUserBySessionToken from "../users/getUserBySessionToken";

class GetUserPack {
  static getById = async (userId: string) => {
    try {
      const pack = await PackModel.findOne({
        members: userId,
      });
      return pack;
    } catch (error) {
      console.error("Error getting pack by ID:", error);
      throw error;
    }
  };

  static getBySessionToken = async (sessionToken: string) => {
    try {
      const user = await getUserBySessionToken(sessionToken);
      if (!user) {
        return null;
      }
      return this.getById(user._id.toString());
    } catch (error) {
      console.error("Error getting pack by session token:", error);
      throw error;
    }
  };
}

export default GetUserPack;
