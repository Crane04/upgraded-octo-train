import express from "express";
import { validateUser } from "../middlewares/validateUser";
import AuthController from "../controllers/AuthController";

export default (router: express.Router) => {
  router.get("/users/retrieve", validateUser, AuthController.getUser);
  router.post("/users/register", AuthController.register);
  router.post("/users/login", AuthController.login);
  router.get("/users/profile", validateUser, AuthController.getUserProfile);
};
