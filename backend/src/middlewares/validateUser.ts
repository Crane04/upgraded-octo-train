import express from "express";
import { get, merge } from "lodash";

// import { getUserBySessionToken } from "../db/users";
import getUserBySessionToken from "../services/users/getUserBySessionToken";
import ApiResponse from "../helpers/ApiResponse";

export const validateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken =
      req.cookies["sessionToken"] || req.headers.authorization?.split(" ")?.[1];
    if (!sessionToken) {
      ApiResponse.error(res, "User is unauthenticated", 401);
      return;
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      ApiResponse.error(res, "User is unauthenticated", 401);
      return;
    }
    merge(req, { identity: user });

    next();
  } catch (error) {
    console.error(error);
  }
};
