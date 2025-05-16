import mongoose from "mongoose";
import PackModel, { Pack } from "../../db/packs";

class JoinPack {
  static run = async (
    userId: mongoose.Types.ObjectId,
    packUniqueId: string
  ): Promise<Pack> => {
    const pack = await PackModel.findOne({ uniqueID: packUniqueId });

    pack.members.push(userId);
    await pack.save();

    return pack;
  };
}

export default JoinPack;
