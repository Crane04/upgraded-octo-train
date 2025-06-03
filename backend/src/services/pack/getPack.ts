import PackModel from "../../db/packs";

class GetUserPack {
  static byName = async (name: string) => {
    const pack = await PackModel.findOne({
      name,
    });
    return pack;
  };

  static byId = (id: string) => {
    const packQuery = PackModel.findOne({
      uniqueID: id,
    });

    return {
      get: async () => {
        return await packQuery;
      },
      members: async () => {
        return await packQuery.populate("members");
      },
    };
  };
}

export default GetUserPack;
