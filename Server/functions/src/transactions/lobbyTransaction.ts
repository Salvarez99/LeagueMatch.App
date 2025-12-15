import { BaseTransaction } from "./baseTransaction";
import { Lobby } from "../models/Lobby";
import type { LobbyTxOptions } from "./options/LobbyTxOptions";
import * as Error from "../utils/AppError";
import type { DocumentReference, DocumentData } from "firebase-admin/firestore";
import { getCallerName } from "../utils/getCallerName";

const baseTx = new BaseTransaction();
export async function LobbyTransaction<TResult>(
  lobbyRef: DocumentReference<DocumentData>,
  uid: string | undefined,
  options: LobbyTxOptions | undefined,
  action: (lobby: Lobby) => TResult | Promise<TResult>
): Promise<TResult> {
  const context = getCallerName(4);

  return baseTx.run<Lobby, TResult>(
    lobbyRef,
    (snap) => Lobby.fromFirestore(snap.data()),
    (lobby) => lobby.toFirestore(),
    async (lobby) => {
      // --- Guards ---
      if (options?.onlyHost) {
        if (!uid)
          throw new Error.BadRequestError(
            `[${context}] uid required for host action`
          );
        if (uid !== lobby.hostId)
          throw new Error.UnauthorizedError(
            `[${context}] Only host can perform this action`
          );
      }

      if (options?.onlySelf) {
        if (!uid)
          throw new Error.BadRequestError(
            `[${context}] uid required for self action`
          );
        if (!options.targetUid)
          throw new Error.BadRequestError(
            `[${context}] targetUid required for self action`
          );
        if (uid !== options.targetUid)
          throw new Error.UnauthorizedError(
            `[${context}] Action can only be performed on self`
          );
      }

      if (options?.stateMustBe && !options.stateMustBe.includes(lobby.state)) {
        throw new Error.BadRequestError(
          `[${context}] Lobby state must be one of: ${options.stateMustBe.join(
            ", "
          )}`
        );
      }

      return action(lobby);
    }
  );
}
