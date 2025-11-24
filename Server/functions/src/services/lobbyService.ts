import { db } from "../firebaseConfig";
import { userService } from "./userService";
import { Lobby } from "../models/Lobby";
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
      throw new Error("hostId and gameMap are required");
    }

    // Ensure host exists
    const host = await userService.getUserById(hostId);
    if (!host) {
      throw new Error("Host user not found");
    }

    if (!host.riotId) {
      const err: any = new Error(
        "Host must link Riot ID before creating a lobby"
      );
      err.code = "MISSING_RIOT_ID";
      throw err;
    }

    const snapshot = await this.lobbiesRef.where("hostId", "==", hostId).get();

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        if (doc.data().isActive) {
          throw new Error(`hostId ${hostId} active lobby already exists`);
        }
      });
    }

    // Create lobby instance from model
    const lobby = new Lobby(
      hostId,
      host.riotId,
      gameMap,
      gameMode,
      hostPosition,
      championId,
      rankFilter ?? []
    );

    // Save to Firestore
    const docRef = await this.lobbiesRef.add(lobby.toFirestore());

    return {
      id: docRef.id,
      ...lobby.toFirestore(),
    };
  }

  async updateReadyStatus(lobbyId: string, uid: string) {
    if (!lobbyId || typeof lobbyId !== "string") {
      throw new Error("Invalid lobbyId (was empty or undefined)");
    }
    if (!uid) throw new Error("uid required");

    const lobbyRef = this.lobbiesRef.doc(lobbyId);
    console.log("LOBBY ID:", lobbyId);
    console.log("REF PATH:", lobbyRef.path);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error("Lobby not found");

      const players = (snap.data()?.players ?? []) as any[];

      const updatedPlayers = players.map((player) => {
        if (player.uid === uid) {
          return { ...player, ready: !player.ready };
        }
        return player;
      });

      tx.update(lobbyRef, { players: updatedPlayers });
    });
  }

  async kickPlayer(lobbyId: string, hostId: string, targetUid: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error("Lobby not found");

      const lobby = Lobby.fromFireStore(snap.data());

      if (lobby.hostId !== hostId) {
        throw new Error("Unauthorized: Only the host can kick players");
      }

      lobby.removePlayer(targetUid, true);

      tx.update(lobbyRef, lobby.toFirestore());
    });
  }

  async updateDiscord(lobbyId: string, hostId: string, discordLink: string) {
    const ref = this.lobbiesRef.doc(lobbyId);

    return db.runTransaction(async (tx) => {
      const lobbyDoc = await tx.get(ref);

      if (!lobbyDoc.exists) {
        throw new Error("Lobby not found");
      }

      if (lobbyDoc.data()?.hostId !== hostId) {
        throw new Error("Not authorized");
      }

      tx.update(ref, { discordLink: discordLink || null });
    });
  }

  async updateChampion(lobbyId: string, uid: string, championId: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error("Lobby not found");

      const players = (snap.data()?.players ?? []) as any[];

      const updatedPlayers = players.map((player) =>
        player.uid === uid ? { ...player, championId } : player
      );

      tx.update(lobbyRef, { players: updatedPlayers });
    });
  }

  async getAvailableLobbies(desiredRole: string) {
    const snapshot = await this.lobbiesRef
      .where("isActive", "==", true)
      // .where("filter.rolesNeeded", "array-contains", desiredRole)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getLobbyById(lobbyId: string) {
    const doc = await this.lobbiesRef.doc(lobbyId).get();

    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() };
  }

  // 🔥 Shared kicked filtering helper
  private filterKicked(
    uid: string,
    docs: QueryDocumentSnapshot<DocumentData>[]
  ) {
    return docs.filter((d) => {
      const data = d.data();
      return !data.kickedPlayers?.includes(uid);
    });
  }

  async findLobby(data: IFindLobbyData) {
    const { gameMap, gameMode, desiredPosition, ranks, uid } = data;

    if (!uid) {
      throw new Error("uid is required to find a lobby");
    }

    switch (gameMap) {
      case "Summoner's Rift":
        if (!desiredPosition) {
          throw new Error(
            "desiredPosition is required for Summoner's Rift Modes"
          );
        }

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
        throw new Error("Unsupported GameMap");
    }
  }

  async joinLobby(lobbyId: string, playerData: IJoinLobbyData) {
    const { uid, position = null, championId = null } = playerData;
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    const user = await userService.getUserById(uid);

    if (!user) throw new Error("User not found");

    if (!user.riotId) {
      const err: any = new Error(
        "User must link Riot ID before joining a lobby"
      );
      err.code = "MISSING_RIOT_ID";
      throw err;
    }

    let resultLobby: any = null;

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      const lobby = Lobby.fromFireStore(lobbySnap.data());

      if (!lobby.isActive) throw new Error("Lobby is inactive");

      lobby.addPlayer(uid, user.riotId, position, championId);

      transaction.update(lobbyRef, lobby.toFirestore());

      resultLobby = { id: lobbyId, ...lobby.toFirestore() };
    });

    return resultLobby;
  }

  async leaveById(lobbyId: string, uid: string) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      const lobby = Lobby.fromFireStore(lobbySnap.data());

      lobby.removePlayer(uid);

      transaction.update(lobbyRef, lobby.toFirestore());
    });
  }

  // Helpers
  private findBase(gameMap: string, gameMode: string): Query<DocumentData> {
    return this.lobbiesRef
      .where("gameMap", "==", gameMap)
      .where("gameMode", "==", gameMode)
      .where("isActive", "==", true);
  }

  private async searchForRift(
    gameMap: string,
    gameMode: string,
    desiredPosition: string,
    ranks: string[] | undefined,
    uid: string
  ) {
    const baseQuery = this.findBase(gameMap, gameMode);

    const positionSnap = await baseQuery
      .where("filter.positionsNeeded", "array-contains", desiredPosition)
      .get();

    const rankSnap = ranks?.length
      ? await baseQuery
          .where("filter.ranksFilter", "array-contains-any", ranks)
          .get()
      : null;

    let mergedDocs: QueryDocumentSnapshot<DocumentData>[];

    if (rankSnap) {
      const positionIds = new Set(positionSnap.docs.map((d) => d.id));
      mergedDocs = rankSnap.docs.filter((d) => positionIds.has(d.id));
    } else {
      mergedDocs = positionSnap.docs;
    }

    const cleaned = this.filterKicked(uid, mergedDocs);

    if (cleaned.length === 0) return null;

    const doc = cleaned[0];
    return { id: doc.id, ...doc.data() };
  }

  private async searchForAram(gameMap: string, gameMode: string, uid: string) {
    const query = this.findBase(gameMap, gameMode);
    const snap = await query.get();

    if (snap.empty) return null;

    const cleaned = this.filterKicked(uid, snap.docs);

    if (cleaned.length === 0) return null;

    return { id: cleaned[0].id, ...cleaned[0].data() };
  }

  private async searchForFeatured(
    gameMap: string,
    gameMode: string,
    uid: string
  ) {
    const query = this.findBase(gameMap, gameMode);
    const snap = await query.get();

    if (snap.empty) return null;

    const cleaned = this.filterKicked(uid, snap.docs);

    if (cleaned.length === 0) return null;

    return { id: cleaned[0].id, ...cleaned[0].data() };
  }
}

export const lobbyService = new LobbyService();
