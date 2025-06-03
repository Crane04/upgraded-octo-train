import mongoose from "mongoose";
import Pack from "../../db/packs";

class LeavePack {
  static run = async (userId: string, id: string) => {
    const pack = await Pack.findOne({ uniqueID: id });

    pack.members = pack.members.filter((memberId) => !memberId.equals(userId));
    await pack.save();

    return pack;
  };
}

export default LeavePack;
