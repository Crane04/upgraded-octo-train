import loginDoctorValidator from "../validators/doctors/loginDoctorValidator";
import DoctorController from "../controllers/DoctorControllers";
import express from "express";
import { validateDoctorHospital } from "../middlewares/validateDoctorOrHospital";
import consultationValidator from "../validators/doctors/consultationValidator";
export default (router: express.Router) => {
  router.post("/doctors/login", loginDoctorValidator, DoctorController.login);
  router.post(
    "/doctors/consultation",
    consultationValidator,
    validateDoctorHospital,
    DoctorController.consultDoctor
  );

  router.get(
    "/doctors/get-consultations",
    validateDoctorHospital,
    DoctorController.getConsultations
  );

  router.post(
    "/doctors/create-patient",
    validateDoctorHospital,
    DoctorController.createPatient
  );
};
