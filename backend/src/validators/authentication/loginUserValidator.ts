import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";
import getUserByEmail from "../../services/users/getUserByEmail";

const schema = {
  email: {
    type: "email",
    required: true,
  },
  password: {
    type: "string",
    min: 6,
  },
};

const v = new Validator({
  messages: {
    required: "This field is required!",
    string: "This field must be a string.",
    email: "Invalid email format.",
  },
});

const loginUserValidator = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
  const userExists = await getUserByEmail(req.body.email);
  if (!userExists) {
    ApiResponse.error(res, "Invalid Credentials", 400);
    return;
  }
  next();
};

export default loginUserValidator;
