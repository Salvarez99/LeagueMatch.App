import { userService } from "../services/userService";
import { Body, Controller, Post, Route } from "tsoa";
import { AddUserRequestDTO, updateUserRequestDTO } from "./dtos/user.dto";

@Route("user")
export class UserController extends Controller {
  @Post("add")
  async addUser(@Body() body: AddUserRequestDTO) {
    const createdUser = await userService.addUser(body);
    return { success: true, createdUser };
  }

  @Post("update")
  async updateUser(@Body() body: updateUserRequestDTO) {
    const updatedUser = await userService.updateUser(body);
    return { success: true, updatedUser };
  }

  // async sendFriendRequest(req: Request, res: Response) {
  //   try {
  //     const uid = req.query.uid as string;
  //     const targetUid = req.query.targetUid as string;

  //     await userService.sendFriendRequest(uid, targetUid);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Successfully sent friend request",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }

  // async respondFriendRequest(req: Request, res: Response) {
  //   try {
  //     const uid = req.query.uid as string;
  //     const incomingUid = req.query.incomingUid as string;
  //     const accepted = req.query.accepted === "true";

  //     await userService.respondFriendRequest(uid, incomingUid, accepted);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Successfully added new friend",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }

  // async removeFriend(req: Request, res: Response) {
  //   try {
  //     const uid = req.query.uid as string;
  //     const targetUid = req.query.targetUid as string;

  //     await userService.removeFriend(uid, targetUid);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Successfully removed friend",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }
  // async toggleBlock(req: Request, res: Response) {
  //   try {
  //     const uid = req.query.uid as string;
  //     const targetUid = req.query.targetUid as string;

  //     await userService.toggleBlock(uid, targetUid);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Successfully blocked user",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }
}

// Singleton export
export const userController = new UserController();
