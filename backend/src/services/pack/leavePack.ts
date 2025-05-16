import mongoose from "mongoose";
import Pack from "../../db/packs";

class LeavePack {
  static run = async (
    userId: mongoose.Types.ObjectId,
    packUniqueId: string
  ) => {
    const pack = await Pack.findOne({ uniqueID: packUniqueId });

    pack.members = pack.members.filter((memberId) => !memberId.equals(userId));
    await pack.save();

    return pack;
  };
}

export default LeavePack;
