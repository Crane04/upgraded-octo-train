import express from "express";
import { get, merge } from "lodash";
import getHospitalBySessionToken from "../services/hospitals/getHospitalBySessionToken";
import getDoctorBySessionToken from "../services/doctors/getDoctorBySessionToken";
import ApiResponse from "../helpers/ApiResponse";

export const validateDoctorHospital = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    console.log(sessionToken);
    if (!sessionToken) {
      ApiResponse.error(res, "User is unauthenticated", 401);
      return;
    }

    const hospital = await getHospitalBySessionToken(sessionToken);
    const doctor = await getDoctorBySessionToken(sessionToken);

    if (!hospital && !doctor) {
      ApiResponse.error(res, "User is unauthenticated", 401);
      return;
    }

    if (hospital) {
      if (!hospital.verified) {
        ApiResponse.error(res, "Hospital isn't verified!", 401);
        return;
      }
      merge(req, { identity: hospital, role: "hospital" });
    } else if (doctor) {
      merge(req, { identity: doctor, role: "doctor" });
    }

    next();
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, "Internal Server Error", 500);
  }
};
