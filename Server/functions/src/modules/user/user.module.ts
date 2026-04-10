import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RiotService } from "./riot.service";

@Module({
  controllers: [UserController],
  providers: [UserService, RiotService],
  exports: [UserService, RiotService],
})
export class UserModule {}
