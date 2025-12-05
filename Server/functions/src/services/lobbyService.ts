import { db } from "../firebaseConfig";
import { userService } from "./userService";
import { Lobby } from "../models/Lobby";
import * as Error from "../utils/AppError";
import {
  ILobbyCreateData,
  IFindLobbyData,
  IJoinLobbyData,
} from "../interfaces/ILobby";

import type {
  CollectionReference,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { ILobby, ILobbyPlayer, IUser, LobbyState } from "@leaguematch/shared";
import { Player } from "../models/Player";
import { read } from "fs";

export class LobbyService {
  private lobbiesRef: CollectionReference<DocumentData>;

  constructor() {
    this.lobbiesRef = db.collection("lobbies");
  }

  async create(lobbyData: ILobbyCreateData) {
    const {
      hostId,
      gameMap,
      gameMode = null,
      hostPosition = null,
      championId = null,
      rankFilter = [],
    } = lobbyData;

    if (!hostId || !gameMap) {
      throw new Error.BadRequestError("hostId and gameMap are required");
    }

    // Ensure host exists
    const host = await userService.getUserById(hostId);
    if (!host) throw new Error.NotFoundError("Host user not found");

    // if (!host.riotId) {
    //   const err: any = new Error.UnauthorizedError(
    //     "Host must link Riot ID before creating a lobby"
    //   );
    //   err.code = "MISSING_RIOT_ID";
    //   throw err;
    // }

    // Check existing active lobby
    const snapshot = await this.lobbiesRef.where("hostId", "==", hostId).get();
    snapshot.forEach((doc) => {
      if (
        doc.data().state === LobbyState.IDLE ||
        doc.data().state === LobbyState.SEARCHING ||
        doc.data().state === LobbyState.FINISHED
      )
        throw new Error.BadRequestError(
          `hostId ${hostId} active lobby already exists`
        );
    });

    // Create lobby instance
    const lobby = new Lobby(
      hostId,
      host.username,
      host.riotId,
      gameMap,
      gameMode,
      hostPosition,
      championId,
      rankFilter
    );

    // Save lobby
    const docRef = await this.lobbiesRef.add(lobby.toFirestore());

    return { id: docRef.id, ...lobby.toFirestore() };
  }

  async updateReadyStatus(lobbyId: string, uid: string) {
    if (!lobbyId) throw new Error.NotFoundError("Invalid lobbyId");
    if (!uid) throw new Error.BadRequestError("uid required");

    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      const lobby = Lobby.fromFirestore(snap.data());
      const players = lobby.players;

      // 1. Toggle ready and ALWAYS convert to plain objects
      const updatedPlayers = players.map((p) =>
        p.uid === uid
          ? new Player(
              p.uid,
              p.username,
              p.riotId,
              p.position,
              p.championId,
              !p.ready
            ).toObject()
          : p instanceof Player
          ? p.toObject()
          : p
      );

      // 2. Update in-memory lobby
      lobby.players = updatedPlayers;

      // 3. Apply FSM (switchLobbyState)
      this.switchLobbyState(lobby);

      // 4. Always use toFirestore() so Firestore sees ONLY plain JSON
      tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
    });
  }

  async initSearch(lobbyId: string, uid: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");
      const lobby = Lobby.fromFirestore(snap.data());
      if (!(uid === lobby.hostId))
        throw new Error.UnauthorizedError("Only host can initiate search");

      lobby.setState(LobbyState.SEARCHING);

      tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
    });
  }

  async kickPlayer(lobbyId: string, hostId: string, targetUid: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      const lobby = Lobby.fromFirestore(snap.data());

      if (lobby.hostId !== hostId)
        throw new Error.UnauthorizedError("Only host can kick players");

      if (lobby.state !== LobbyState.IDLE && lobby.state !== LobbyState.FINISHED) {
        throw new Error.BadRequestError(
          "Players can only be kicked while in IDLE and FINISHED"
        );
      }

      lobby.removePlayer(targetUid, true);
      this.switchLobbyState(lobby);


      // Full object write — use set()
      tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
    });
  }

  async updateDiscord(lobbyId: string, hostId: string, discordLink: string) {
    const ref = this.lobbiesRef.doc(lobbyId);

    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      if (snap.data()!.hostId !== hostId)
        throw new Error.UnauthorizedError("Not authorized");

      // Partial update — update()
      tx.update(ref, { discordLink: discordLink || null });
    });
  }

  async updateChampion(lobbyId: string, uid: string, championId: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      const players = (snap.data()?.players ?? []) as any[];

      const updatedPlayers = players.map((p) =>
        p.uid === uid ? { ...p, championId } : p
      );

      // Partial update — allowed
      tx.update(lobbyRef, { players: updatedPlayers });
    });
  }

  async getAvailableLobbies(desiredRole: string) {
    const snapshot = await this.lobbiesRef
      .where("state", "==", "SEARCHING")
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getLobbyById(lobbyId: string) {
    const doc = await this.lobbiesRef.doc(lobbyId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  private filterKicked(
    uid: string,
    docs: QueryDocumentSnapshot<DocumentData>[]
  ) {
    return docs.filter((d) => !d.data().kickedPlayers?.includes(uid));
  }

  async findLobby(data: IFindLobbyData) {
    const { gameMap, gameMode, desiredPosition, ranks, uid } = data;

    if (!uid) throw new Error.BadRequestError("uid required");

    switch (gameMap) {
      case "Summoner's Rift":
        if (!desiredPosition)
          throw new Error.BadRequestError("desiredPosition required");
        return this.searchForRift(
          gameMap,
          gameMode,
          desiredPosition,
          ranks ?? [],
          uid
        );

      case "Aram":
        return this.searchForAram(gameMap, gameMode, uid);

      case "Featured Mode":
        return this.searchForFeatured(gameMap, gameMode, uid);

      default:
        throw new Error.BadRequestError("Unsupported GameMap");
    }
  }

  async joinLobby(lobbyId: string, playerData: IJoinLobbyData) {
    const { uid, position = null, championId = null } = playerData;

    const lobbyRef = this.lobbiesRef.doc(lobbyId);
    const user = await userService.getUserById(uid);

    if (!user) throw new Error.NotFoundError("User not found");
    // if (!user.riotId) {
    //   const err: any = new Error.UnauthorizedError("User must link Riot ID");
    //   err.code = "MISSING_RIOT_ID";
    //   throw err;
    // }

    let resultLobby: any = null;

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      const lobby = Lobby.fromFirestore(snap.data());

      if (lobby.state != LobbyState.SEARCHING)
        throw new Error.BadRequestError("Lobby inactive");

      lobby.addPlayer(uid, user.username, user.riotId, position, championId);

      this.switchLobbyState(lobby);
      // Full object write — use set()
      tx.set(lobbyRef, lobby.toFirestore(), { merge: true });

      resultLobby = { id: lobbyId, ...lobby.toFirestore() };
    });

    return resultLobby;
  }

  async leaveById(lobbyId: string, uid: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error.NotFoundError("Lobby not found");

      const lobby = Lobby.fromFirestore(snap.data());
      lobby.removePlayer(uid);
      this.switchLobbyState(lobby);

      // Full write — set()
      tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
    });
  }

  private findBase(gameMap: string, gameMode: string): Query<DocumentData> {
    return this.lobbiesRef
      .where("gameMap", "==", gameMap)
      .where("gameMode", "==", gameMode)
      .where("state", "==", "SEARCHING");
  }

  private async searchForRift(
    gameMap: string,
    gameMode: string,
    desiredPosition: string,
    ranks: string[],
    uid: string
  ) {
    const base = this.findBase(gameMap, gameMode);

    const positionSnap = await base
      .where("filter.positionsNeeded", "array-contains", desiredPosition)
      .get();

    const rankSnap =
      ranks.length > 0
        ? await base
            .where("filter.ranksFilter", "array-contains-any", ranks)
            .get()
        : null;

    const merged = rankSnap
      ? rankSnap.docs.filter((d) =>
          new Set(positionSnap.docs.map((p) => p.id)).has(d.id)
        )
      : positionSnap.docs;

    const cleaned = this.filterKicked(uid, merged);

    if (cleaned.length === 0) return null;

    const doc = cleaned[0];
    return { id: doc.id, ...doc.data() };
  }

  private async searchForAram(gameMap: string, gameMode: string, uid: string) {
    const snap = await this.findBase(gameMap, gameMode).get();
    if (snap.empty) return null;

    const cleaned = this.filterKicked(uid, snap.docs);
    return cleaned.length ? { id: cleaned[0].id, ...cleaned[0].data() } : null;
  }

  private async searchForFeatured(
    gameMap: string,
    gameMode: string,
    uid: string
  ) {
    const snap = await this.findBase(gameMap, gameMode).get();
    if (snap.empty) return null;

    const cleaned = this.filterKicked(uid, snap.docs);
    return cleaned.length ? { id: cleaned[0].id, ...cleaned[0].data() } : null;
  }

  switchLobbyState(lobby: Lobby): void {
    const players = lobby.players;
    switch (lobby.state) {
      case LobbyState.IDLE:
        if (
          players.length === lobby.maxPlayers &&
          players.every((player) => player.ready)
        ) {
          lobby.setState(LobbyState.FINISHED);
        }
        break;
      case LobbyState.SEARCHING:
        if (players.length === lobby.maxPlayers)
          lobby.setState(LobbyState.IDLE);
        break;
      case LobbyState.FINISHED:
        if (players.length < lobby.maxPlayers || !lobby.players.every((player)=>player.ready)) lobby.setState(LobbyState.IDLE);
    }
  }
}

export const lobbyService = new LobbyService();
