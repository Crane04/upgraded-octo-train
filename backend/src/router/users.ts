import express from "express";
import { validateUser } from "../middlewares/validateUser";
import AuthController from "../controllers/AuthController";
import updateProfileValidator from "../validators/profile/updateProfile";
import ProfileController from "../controllers/ProfileController";

export default (router: express.Router) => {
  router.get("/users/retrieve", validateUser, AuthController.getUser);
  router.post("/users/register", AuthController.register);
  router.post("/users/login", AuthController.login);
  router.get("/users/profile", validateUser, AuthController.getUserProfile);
  router.put(
    "/hospitals/update/:username",
    validateUser,
    updateProfileValidator,
    ProfileController.updateUserProfile
  );
  router.get("/users/all", AuthController.getAllUsers);
};
