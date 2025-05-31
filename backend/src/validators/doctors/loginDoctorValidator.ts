import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";
import getDoctorByEmail from "../../services/doctors/getDoctorByEmail";

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

const loginDoctorValidator = async (
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
  const doctorExists = await getDoctorByEmail(req.body.email);

  if (!doctorExists) {
    ApiResponse.error(res, "Invalid Credentials", 400);
    return;
  }
  next();
};

export default loginDoctorValidator;
