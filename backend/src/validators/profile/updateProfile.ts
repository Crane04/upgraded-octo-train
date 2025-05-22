import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";

const schema = {
  address: { type: "string", optional: true },
  gender: { type: "enum", values: ["Male", "Female", "Other"], optional: true },
  genotype: { type: "string", optional: true },
  bloodGroup: { type: "string", optional: true },
  disability: { type: "string", optional: true, nullable: true },
  phoneNumber: { type: "string", optional: true },
  dateOfBirth: { type: "date", convert: true, optional: true },
  image: { type: "string", optional: true },
  previousHospital: { type: "string", optional: true },
  additionalNote: { type: "string", optional: true },
  allergy: { type: "string", optional: true },
  newHistory: { type: "string", optional: true },
};

const v = new Validator({
  messages: {
    string: "This field must be a string.",
    enumValue: "This field must be one of the allowed values.",
    date: "This field must be a valid date.",
  },
});

const updateProfileValidator = async (
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

  next();
};

export default updateProfileValidator;
