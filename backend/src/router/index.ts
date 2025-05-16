import express from "express";
import users from "./users";
import hospitals from "./hospitals";
const router = express.Router();

export default (): express.Router => {
  users(router);
  hospitals(router)
  return router;
};
