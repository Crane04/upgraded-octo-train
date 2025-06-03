import PackModel from "../../db/packs";
import mongoose from "mongoose";

class CreatePack {
  static run = async (name: string, userId: mongoose.Types.ObjectId) => {
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);
    const pack = await PackModel.create({
      name,
      uniqueID: nanoid(),
      leader: userId,
      members: [userId],
    });

    return pack;
  };
}

export default CreatePack;