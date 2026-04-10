import { Module } from "@nestjs/common";
import { LobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
})
export class LobbyModule {}
