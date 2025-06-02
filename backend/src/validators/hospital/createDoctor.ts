import express from "express";
import ApiResponse from "../../helpers/ApiResponse";
import Validator from "fastest-validator";
import getDoctorByEmail from "../../services/doctors/getDoctorByEmail";
import getDoctorByUsername from "../../services/doctors/getDoctorByUsername";

const schema = {
  fullName: {
    type: "string",
    min: 3,
    messages: {
      required: "Full name is required.",
      stringMin: "Full name must be at least 3 characters.",
    },
  },
  username: {
    type: "string",
    min: 3,
    messages: {
      required: "Username is required.",
      stringMin: "Username must be at least 3 characters.",
    },
  },
  email: {
    type: "email",
    messages: {
      required: "Email is required.",
      email: "Email must be a valid email address.",
    },
  },

  gender: {
    type: "string",
    enum: ["Male", "Female"],
    messages: {
      required: "Gender is required.",
      enum: "Gender must be either Male or Female.",
    },
  },
  speciality: {
    type: "string",
    min: 3,
    messages: {
      required: "Speciality is required.",
      stringMin: "Speciality must be at least 3 characters.",
    },
  },
  phoneNumber: {
    type: "number",
    messages: {
      required: "Phone number is required.",
      number: "Phone number must be a valid number.",
    },
  },
  bio: {
    type: "string",
  },
};

const v = new Validator();

const createDoctorValidator = async (
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

  const { email, username } = req.body;

  const doctorWithEmail = await getDoctorByEmail(email);
  if (doctorWithEmail) {
    return ApiResponse.error(res, "Doctor with this email already exists", 400);
  }

  const doctorWithUsername = await getDoctorByUsername(username);
  if (doctorWithUsername) {
    return ApiResponse.error(
      res,
      "Doctor with this username already exists",
      400
    );
  }
  console.log("hereeeee");
  next();
};

export default createDoctorValidator;
