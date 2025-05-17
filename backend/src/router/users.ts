import express from "express";
import { validateUser } from "../middlewares/validateUser";
import AuthController from "../controllers/AuthController";
import updateProfileValidator from "../validators/profile/updateProfile";
import ProfileController from "../controllers/ProfileController";
import { validateHospital } from "../middlewares/validateHospital";

export default (router: express.Router) => {
  router.get("/users/retrieve", validateUser, AuthController.getUser);
  router.post("/users/register", AuthController.register);
  router.post("/users/login", AuthController.login);
  router.get("/users/profile", validateUser, AuthController.getUserProfile);
  router.put(
    "/users/update/:username",
    validateUser,
    updateProfileValidator,
    ProfileController.updateUserProfile
  );
  router.get("/users/all", validateHospital, AuthController.getAllUsers);
};
