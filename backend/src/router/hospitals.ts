import express from "express";
import { validateUser } from "../middlewares/validateUser";
import HospitalController from "../controllers/HospitalControllers";
import loginHospitalValidator from "../validators/hospital/loginHospitalValidator";
import createHospitalValidator from "../validators/hospital/createHospitalValidator";
import { create } from "lodash";

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
};
