import { userService } from "../services/userService";
import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  Route,
  Security,
  Request,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import { AddUserRequestDTO, updateUserRequestDTO } from "./dtos/user.dto";

@Route("user")
export class UserController extends Controller {
  @Post("add")
  async addUser(@Body() body: AddUserRequestDTO) {
    const createdUser = await userService.addUser(body);
    return { success: true, createdUser };
  }

  @Security("firebaseAuth")
  @Post("update")
  async updateUser(
    @Request() req: ExpressRequest,
    @Body() body: updateUserRequestDTO
  ) {
    const updatedUser = await userService.updateUser(req.user!.uid, body);
    return { success: true, updatedUser };
  }

  @Post("sendFriendRequest")
  async sendFriendRequest(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string
  ) {
    await userService.sendFriendRequest(uid, targetUid);

    return {
      success: true,
      message: "Successfully sent friend request",
    };
  }

  @Patch("respondFriendRequest")
  async respondFriendRequest(
    @Query("uid") uid: string,
    @Query("incomingUid") incomingUid: string,
    @Query("accepted") accepted: boolean
  ) {
    await userService.respondFriendRequest(uid, incomingUid, accepted);

    return {
      success: true,
      message: "Successfully added new friend",
    };
  }

  @Delete("removeFriend")
  async removeFriend(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string
  ) {
    await userService.removeFriend(uid, targetUid);

    return {
      success: true,
      message: "Successfully removed friend",
    };
  }

  @Patch("toggleBlock")
  async toggleBlock(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string
  ) {
    await userService.toggleBlock(uid, targetUid);

    return {
      success: true,
      message: "Successfully blocked user",
    };
  }
}

// Singleton export
export const userController = new UserController();
