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

  async acceptFriendRequest(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const incomingUid = req.query.incomingUid as string;

      await userService.acceptFriendRequest(uid, incomingUid);

      return res.status(200).json({
        success: true,
        message: "Successfully added new friend"
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

      const { id, username, riotId } = req.body as {
        id: string | null;
        username: string | null;
        riotId: string;
      };

      const updatedUser = await userService.updateUser(id, username, riotId);

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
}

// Singleton export
export const userController = new UserController();
