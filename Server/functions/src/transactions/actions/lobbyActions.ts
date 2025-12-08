import { LobbyTransaction } from "../lobbyTransaction";
import { db } from "../../firebaseConfig";
import { LobbyState } from "@leaguematch/shared";
import { Lobby } from "../../models/Lobby";

export function hostAction<T>(params: {
  lobbyId: string;
  uid: string;
  action: (lobby: Lobby) => T | Promise<T>;
  states?: LobbyState[];
}) {
  const { lobbyId, uid, action, states } = params;
  const ref = db.collection("lobbies").doc(lobbyId);

  return LobbyTransaction(
    ref,
    uid,
    {
      onlyHost: true,
      stateMustBe: states,
    },
    action
  );
}

export function selfAction<T>(params: {
  lobbyId: string;
  uid: string;
  action: (lobby: Lobby) => T | Promise<T>;
  states?: LobbyState[];
}) {
  const { lobbyId, uid, action, states } = params;
  const ref = db.collection("lobbies").doc(lobbyId);

  return LobbyTransaction(
    ref,
    uid,
    {
      onlySelf: true,
      targetUid: uid,
      stateMustBe: states,
    },
    action
  );
}

export function JoinerAction<T>(params: {
  lobbyId: string;
  uid: string;
  action: (lobby: Lobby) => T | Promise<T>;
  states?: LobbyState[];
}) {
  const { lobbyId, uid, action, states } = params;
  const ref = db.collection("lobbies").doc(lobbyId);

  return LobbyTransaction(
    ref,
    uid,
    {
      onlySelf: false,
      onlyHost: false,
      stateMustBe: states,
    },
    action
  );
}
