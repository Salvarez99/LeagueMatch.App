import { Request, Response } from "express";
import { userService } from "../services/userService";
import { IUserData } from "../interfaces/IUserData";

export class UserController {
  // POST /addUser
  async addUser(req: Request, res: Response) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const userDTO: IUserData = req.body;
      const createdUser = await userService.addUser(userDTO);

      return res.status(200).json({
        success: true,
        createdUser,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // POST /updateUser
  async updateUser(req: Request, res: Response) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const { id, riotId } = req.body as {
        id: string;
        riotId: string;
      };

      const updatedUser = await userService.updateUser(id, riotId);

      return res.status(200).json({
        success: true,
        updatedUser,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async sendFriendRequest(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const targetUid = req.query.targetUid as string;

      await userService.sendFriendRequest(uid, targetUid);

      return res.status(200).json({
        success: true,
        message: "Successfully sent friend request",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async respondFriendRequest(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const incomingUid = req.query.incomingUid as string;
      const accepted = req.query.accepted === "true";

      await userService.respondFriendRequest(uid, incomingUid, accepted);

      return res.status(200).json({
        success: true,
        message: "Successfully added new friend",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async removeFriend(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const targetUid = req.query.targetUid as string;

      await userService.removeFriend(uid, targetUid);

      return res.status(200).json({
        success: true,
        message: "Successfully removed friend",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
  async toggleBlock(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const targetUid = req.query.targetUid as string;

      await userService.toggleBlock(uid, targetUid);

      return res.status(200).json({
        success: true,
        message: "Successfully blocked user",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

// Singleton export
export const userController = new UserController();
