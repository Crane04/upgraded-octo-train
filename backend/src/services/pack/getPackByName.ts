import PackModel from "../../db/packs";

class GetUserPackByName {
  static run = async (name: string) => {
    const pack = PackModel.findOne({
      name,
    });
    return pack;
  };
}

export default GetUserPackByName;
