import loginDoctorValidator from "../validators/doctors/loginDoctorValidator";
import DoctorController from "../controllers/DoctorControllers";
import express from "express";
export default (router: express.Router) => {
  router.post(
    "/doctors/login",
    loginDoctorValidator,
    DoctorController.login
  );
};
