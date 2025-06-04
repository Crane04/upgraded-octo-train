import express from "express";
import { get, merge } from "lodash";
import getHospitalBySessionToken from "../services/hospitals/getHospitalBySessionToken";
import getDoctorBySessionToken from "../services/doctors/getDoctorBySessionToken";
import ApiResponse from "../helpers/ApiResponse";

export const validateHospital = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    if (!sessionToken) {
      ApiResponse.error(res, "Hospital is unauthenticated", 401);
      return;
    }

    const hospital = await getHospitalBySessionToken(sessionToken);

    if (!hospital) {
      ApiResponse.error(res, "Hospital is unauthenticated", 401);
      return;
    }
    if (!hospital.verified) {
      ApiResponse.error(res, "Hospital isn't verified", 401);
      return;
    }
    merge(req, { identity: hospital });

    next();
  } catch (error) {
    console.error(error);
  }
};
