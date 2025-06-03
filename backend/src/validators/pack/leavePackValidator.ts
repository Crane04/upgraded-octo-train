import { NextFunction, Request, Response } from "express";
import Validator from "fastest-validator";
import ApiResponse from "../../helpers/ApiResponse";
import GetUserPackByName from "../../services/pack/getPack";
import GetUserPack from "../../services/pack/getPackByUser";

const schema = {
  id: {
    type: "string",
    min: 1,
  },
};

const v = new Validator({
  messages: {
    required: "This field is required",
    stringMin: "This field must be at least {expected} characters.",
  },
});

const leavePackValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await v.validate(req.body, schema);

  if (result !== true) {
    const errors = result.map((err) => ({
      field: err.field || "unknown",
      message: err.message,
    }));
    ApiResponse.validationError(res, "Validation failed", errors);
    return;
  }

  const { id } = req.body;
  const sessionToken =
    req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

  const packExists = await GetUserPackByName.byId(id).get();

  if (!packExists) {
    ApiResponse.error(res, "Pack with this ID doesn't exist!", 400);
    return;
  }

  const isUserInPack = await GetUserPack.getBySessionToken(sessionToken);

  if (!isUserInPack || isUserInPack.uniqueID !== id) {
    ApiResponse.error(res, "You're not in this pack", 400);
    return;
  }

  next();
};

export default leavePackValidator;
