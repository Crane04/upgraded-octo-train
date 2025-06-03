import { Request, Response } from "express";
import CreatePack from "../services/pack/createPack";
import getUserBySessionToken from "../services/users/getUserBySessionToken";
import ApiResponse from "../helpers/ApiResponse";

class PackControllers {
  static createPack = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.body;
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    const getUser = await getUserBySessionToken(sessionToken);

    const newPack = await CreatePack.run(name, getUser._id);

    ApiResponse.success(res, "Pack created successfully", newPack);
  };
}

export default PackControllers;
