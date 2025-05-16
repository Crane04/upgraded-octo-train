import PackModel from "db/packs";

class GetUserPack {
  static getPack = async (userId: string) => {
    const pack = PackModel.findOne({
      members: userId,
    });
    return pack;
  };
}

export default GetUserPack;
