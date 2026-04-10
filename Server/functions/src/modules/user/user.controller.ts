import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { UserService } from "./user.service";
import {
  AddUserRequestDto,
  UpdateUserRequestDto,
} from "../../common/dtos/user.dto";
import { Request } from "express";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("add")
  @ApiOperation({ summary: "Add a new user" })
  async addUser(@Body() body: AddUserRequestDto) {
    const createdUser = await this.userService.addUser(body);
    return { success: true, createdUser };
  }

  @Post("update")
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth("firebaseAuth")
  @ApiOperation({ summary: "Update user profile with Riot ID" })
  async updateUser(@Req() req: Request, @Body() body: UpdateUserRequestDto) {
    const updatedUser = await this.userService.updateUser(
      (req as any).user.uid,
      body,
    );
    return { success: true, updatedUser };
  }

  @Post("sendFriendRequest")
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth("firebaseAuth")
  @ApiOperation({ summary: "Send a friend request" })
  async sendFriendRequest(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string,
  ) {
    await this.userService.sendFriendRequest(uid, targetUid);

    return {
      success: true,
      message: "Successfully sent friend request",
    };
  }

  @Patch("respondFriendRequest")
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth("firebaseAuth")
  @ApiOperation({ summary: "Respond to a friend request" })
  async respondFriendRequest(
    @Query("uid") uid: string,
    @Query("incomingUid") incomingUid: string,
    @Query("accepted") accepted: boolean,
  ) {
    await this.userService.respondFriendRequest(uid, incomingUid, accepted);

    return {
      success: true,
      message: "Successfully added new friend",
    };
  }

  @Delete("removeFriend")
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth("firebaseAuth")
  @ApiOperation({ summary: "Remove a friend" })
  async removeFriend(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string,
  ) {
    await this.userService.removeFriend(uid, targetUid);

    return {
      success: true,
      message: "Successfully removed friend",
    };
  }

  @Patch("toggleBlock")
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth("firebaseAuth")
  @ApiOperation({ summary: "Toggle blocking a user" })
  async toggleBlock(
    @Query("uid") uid: string,
    @Query("targetUid") targetUid: string,
  ) {
    await this.userService.toggleBlock(uid, targetUid);

    return {
      success: true,
      message: "Successfully toggled block status",
    };
  }
}
