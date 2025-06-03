import PackModel from "../../db/packs";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

class CreatePack {
  static run = async (name: string, userId: mongoose.Types.ObjectId) => {
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