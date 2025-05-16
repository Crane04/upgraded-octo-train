import express from "express";
import { validateUser } from "../middlewares/validateUser";
import HospitalController from "../controllers/HospitalControllers";
import loginHospitalValidator from "../validators/hospital/loginHospitalValidator";
import createHospitalValidator from "../validators/hospital/createHospitalValidator";
import { create } from "lodash";
import { validateHospital } from "../middlewares/validateHospital";

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
    "/hospitals/login",
    loginHospitalValidator,
    HospitalController.login
  );
  router.get(
    "/hospitals/get-user-profile/:username",
    validateHospital,
    HospitalController.getUserProfile
  );
};
