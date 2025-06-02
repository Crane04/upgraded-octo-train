import express from "express";
import { validateUser } from "../middlewares/validateUser";
import AuthController from "../controllers/AuthController";
import updateProfileValidator from "../validators/profile/updateProfile";
import ProfileController from "../controllers/ProfileController";
import upload from "../middlewares/multer";
import { validateDoctorHospital } from "../middlewares/validateDoctorOrHospital";

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
  router.get("/users/all", validateDoctorHospital, AuthController.getAllUsers);
  router.put(
    "/users/update-profile-image",
    validateUser,
    upload.single("image"),
    ProfileController.updateImage
  );
};
