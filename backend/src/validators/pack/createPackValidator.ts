import { NextFunction, Request, Response } from "express";
import Validator from "fastest-validator";
import ApiResponse from "../../helpers/ApiResponse";
import GetUserPack from "../../services/pack/getPack";

const schema = {
  name: {
    type: "string",
    min: 6,
    required: true,
    messages: {
      required: "Pack name is required.",
      stringMin: "Pack name must be at least 6 characters.",
    },
  },
};

const v = new Validator({
  messages: {
    required: "This field is required",
    stringMin: "This field must be at least {expected} characters.",
  },
});

const createPackValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await v.validate(req.body, schema);
  console.log(req.body);
  console.log({ result });
  if (result !== true) {
    const errors = result.map((err) => ({
      field: err.field || "unknown",
      message: err.message,
    }));
    ApiResponse.validationError(res, "Validation failed", errors);
    return;
  }
  const { name } = req.body;
  if (!name) {
    ApiResponse.error(res, "Pack name cannot be empty", 400);
  }
  const packExists = await GetUserPack.byName(name);
  if (packExists) {
    ApiResponse.error(res, "Pack with this name exists already!", 400);
    return;
  }

  next();
};

export default createPackValidator;
