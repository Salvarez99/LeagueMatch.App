import { Request, Response } from "express";
import { userService } from "../services/userService";
import { IUser } from "@leaguematch/shared";

export class UserController {
  // POST /addUser
  async addUser(req: Request, res: Response) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const userDTO: IUser = req.body;
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

      const { uid, username, riotId } = req.body as {
        uid: string | null;
        username: string | null;
        riotId: string;
      };

      const updatedUser = await userService.updateUser(uid, username, riotId);

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
