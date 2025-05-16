import mongoose from "mongoose";

export interface Pack {
  name: string;
  uniqueID: string;
  members?: mongoose.Types.ObjectId[];
  leader: mongoose.Types.ObjectId;
}

const PackSchema = new mongoose.Schema<Pack>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  uniqueID: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const PackModel = mongoose.model<Pack>("Pack", PackSchema);
export default PackModel;
