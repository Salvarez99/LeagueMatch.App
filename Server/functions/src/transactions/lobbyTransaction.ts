import { BaseTransaction } from "./baseTransaction";
import { Lobby } from "../models/Lobby";
import type { LobbyTxOptions } from "./options/LobbyTxOptions";
import * as Error from "../utils/AppError";
import type { DocumentReference, DocumentData } from "firebase-admin/firestore";

const baseTx = new BaseTransaction();
export async function LobbyTransaction<TResult>(
  lobbyRef: DocumentReference<DocumentData>,
  uid: string | undefined,
  options: LobbyTxOptions | undefined,
  action: (lobby: Lobby) => TResult | Promise<TResult>
): Promise<TResult> {
  return baseTx.run<Lobby, TResult>(
    lobbyRef,
    (raw) => Lobby.fromFirestore(raw),
    (lobby) => lobby.toFirestore(),
    async (lobby) => {
      // --- Guards ---
      if (options?.onlyHost) {
        if (!uid)
          throw new Error.BadRequestError("uid required for host action");
        if (uid !== lobby.hostId)
          throw new Error.UnauthorizedError(
            "Only host can perform this action"
          );
      }

      if (options?.onlySelf) {
        if (!uid)
          throw new Error.BadRequestError("uid required for self action");
        if (!options.targetUid)
          throw new Error.BadRequestError("targetUid required for self action");
        if (uid !== options.targetUid)
          throw new Error.UnauthorizedError(
            "Action can only be performed on self"
          );
      }

      if (options?.stateMustBe && !options.stateMustBe.includes(lobby.state)) {
        throw new Error.BadRequestError(
          `Lobby state must be one of: ${options.stateMustBe.join(", ")}`
        );
      }

      return action(lobby); 
    }
  );
}
