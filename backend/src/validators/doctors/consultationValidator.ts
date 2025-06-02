import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";
import getDoctorBySessionToken from "../../services/doctors/getDoctorBySessionToken";

const schema = {
  patient: {
    type: "string",
    required: true,
  },
  conversation: {
    type: "string",
    min: 6,
  },
};

const v = new Validator({
  messages: {
    required: "This field is required!",
    string: "This field must be a string.",
  },
});

const consultationValidator = async (
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
  const sessionToken =
    req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

  const doctorExists = await getDoctorBySessionToken(sessionToken);

  if (!doctorExists) {
    ApiResponse.error(res, "Doctor doesn't exist!", 400);
    return;
  }
  next();
};

export default consultationValidator;
