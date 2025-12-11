import { LobbyState } from "@leaguematch/shared";

export interface LobbyTxOptions {
  onlyHost?: boolean;
  onlySelf?: boolean;
  targetUid?: string;
  stateMustBe?: LobbyState[];
}
