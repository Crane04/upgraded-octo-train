import express from "express";
import { get, merge } from "lodash";
import getHospitalBySessionToken from "../services/hospitals/getHospitalBySessionToken";
import ApiResponse from "../helpers/ApiResponse";

export const validateHospital = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization.split(" ")[1];

    console.log(sessionToken);
    if (!sessionToken) {
      ApiResponse.error(res, "Hospital is unauthenticated", 401);
      return;
    }

    const Hospital = await getHospitalBySessionToken(sessionToken);

    if (!Hospital) {
      ApiResponse.error(res, "Hospital is unauthenticated", 401);
      return;
    }
    merge(req, { identity: Hospital });

    next();
  } catch (error) {
    console.error(error);
  }
};
