import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.post("/add", userController.addUser.bind(userController));
router.patch("/update", userController.updateUser.bind(userController));
router.post("/sendFriendRequest", userController.sendFriendRequest.bind(userController));
router.post("/respondFriendRequest", userController.respondFriendRequest.bind(userController));
router.delete("/removeFriend", userController.removeFriend.bind(userController));
router.patch("/toggleBlock", userController.toggleBlock.bind(userController));


export const userRouter = router;