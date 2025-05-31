import express from "express";
import users from "./users";
import hospitals from "./hospitals";
import doctors from "./doctors";
const router = express.Router();

export default (): express.Router => {
  users(router);
  hospitals(router);
  doctors(router);
  return router;
};
