import { LobbyState } from "@leaguematch/shared";

export interface TransactionOptions {
  onlyHost?: boolean;
  onlySelf?: boolean;
  targetUid?: string;
  stateMustBe?: LobbyState[];
}
