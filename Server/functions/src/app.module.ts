import { Module } from "@nestjs/common";
import { LobbyModule } from "./modules/lobby/lobby.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [LobbyModule, UserModule],
})
export class AppModule {}
