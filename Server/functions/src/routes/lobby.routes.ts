import { Router } from "express";
import { lobbyController } from "../controllers/lobbyController";

const router = Router();

router.post("/create", lobbyController.create.bind(lobbyController));
router.patch("/ready", lobbyController.ready.bind(lobbyController));
router.patch("/addGhost", lobbyController.addGhost.bind(lobbyController));
router.patch("/updateGhost", lobbyController.updateGhost.bind(lobbyController));
router.patch("/initSearch", lobbyController.initSearch.bind(lobbyController));
router.delete("/kick", lobbyController.kick.bind(lobbyController));
router.patch(
  "/updateDiscord",
  lobbyController.updateDiscord.bind(lobbyController)
);
router.patch(
  "/updateChampion",
  lobbyController.updateChampion.bind(lobbyController)
);
router.get(
  "/getAvailableLobbies",
  lobbyController.getAvailableLobbies.bind(lobbyController)
);
router.get("/get", lobbyController.get.bind(lobbyController));
router.get("/find", lobbyController.find.bind(lobbyController));
router.patch("/join", lobbyController.join.bind(lobbyController));
router.delete("/leave", lobbyController.leave.bind(lobbyController));

export const lobbyRouter = router;
