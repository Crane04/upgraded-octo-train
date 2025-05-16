import { NextFunction, Request, Response } from "express";
import Validator from "fastest-validator";
import ApiResponse from "../../helpers/ApiResponse";
import GetUserPackByName from "services/pack/getPackByName";

const schema = {
  name: {
    type: "string",
    minString: 6,
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

  if (result !== true) {
    const errors = result.map((err) => ({
      field: err.field || "unknown",
      message: err.message,
    }));
    ApiResponse.validationError(res, "Validation failed", errors);
    return;
  }
  const { name } = req.body;
  const packExists = await GetUserPackByName.run(name);
  if (packExists) {
    ApiResponse.error(res, "Pack with this name exists already!", 400);
    return;
  }

  next();
};

export default createPackValidator;
