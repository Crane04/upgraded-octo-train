import express from "express";
import { validateUser } from "../middlewares/validateUser";
import HospitalController from "../controllers/HospitalControllers";
import loginHospitalValidator from "../validators/hospital/loginHospitalValidator";
import createHospitalValidator from "../validators/hospital/createHospitalValidator";

import { validateHospital } from "../middlewares/validateHospital";
import { validateDoctorHospital } from "../middlewares/validateDoctorOrHospital";
import updateProfileValidator from "../validators/profile/updateProfile";
import ProfileController from "../controllers/ProfileController";
import createDoctorValidator from "../validators/hospital/createDoctor";

export default (router: express.Router) => {
  router.get(
    "/hospitals/retrieve",
    validateUser,
    HospitalController.getHospital
  );
  router.post(
    "/hospitals/register",
    createHospitalValidator,
    HospitalController.register
  );
  router.post(
    "/hospitals/create-doctor",
    createDoctorValidator,
    validateHospital,
    HospitalController.createDoctor
  );
  router.get(
    "/hospitals/get-doctors",
    validateHospital,
    HospitalController.getDoctors
  );
  router.post(
    "/hospitals/login",
    loginHospitalValidator,
    HospitalController.login
  );
  router.get(
    "/hospitals/get-user-profile/:username",
    validateDoctorHospital,
    HospitalController.getUserProfile
  );

  router.put(
    "/hospitals/update-user-profile/:username",
    updateProfileValidator,
    validateDoctorHospital,
    ProfileController.updateUserProfileByHospital
  );

  router.post("/hospitals/verify", HospitalController.verifyHospital);
};
