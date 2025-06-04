import express from "express";
import { validateUser } from "../middlewares/validateUser";
import PackControllers from "../controllers/PackControllers";
import createPackValidator from "../validators/pack/createPackValidator";
import joinPackValidator from "../validators/pack/joinPackValidator";
import leavePackValidator from "../validators/pack/leavePackValidator";

export default (router: express.Router) => {
  router.post(
    "/pack/create",
    validateUser,
    createPackValidator,
    PackControllers.createPack
  );

  router.post(
    "/pack/join",
    validateUser,
    joinPackValidator,
    PackControllers.joinPack
  );

  router.post(
    "/pack/leave",
    validateUser,
    leavePackValidator,
    PackControllers.leavePack
  );

  router.get("/pack/members/:id", validateUser, PackControllers.getPackMembers);

  router.get("/pack", validateUser, PackControllers.getPack);

  router.post("/pack/summarize-history", PackControllers.getPackProfiles);
};
