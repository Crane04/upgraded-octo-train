import PackModel from "../../db/packs";
import mongoose from "mongoose";

class CreatePack {

  static run = async(name: string, userId: mongoose.Types.ObjectId) => {
    const pack = await PackModel.create({
        
    })
  };
}
