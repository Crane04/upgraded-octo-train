import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";
import getUserByEmail from "../../services/users/getUserByEmail";

const schema = {
  username: {
    type: "string",
    min: 5,
  },
  email: {
    type: "email",
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
    stringMin: "This field must be at least {expected} characters.",
    email: "Invalid email format.",
  },
});

const createUserValidator = async (
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
  const { email } = req.body;

  const userExists = await getUserByEmail(email);
  if (userExists) {
    ApiResponse.error(res, "User with this email already exists", 400);
    return;
  }

  next();
};

export default createUserValidator;
