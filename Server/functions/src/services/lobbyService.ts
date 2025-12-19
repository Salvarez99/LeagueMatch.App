import { db } from "../firebaseConfig";
import { userService } from "./userService";
import { Lobby } from "../models/Lobby";
import * as Error from "../utils/AppError";
import {
  ILobbyCreateData,
  IFindLobbyData,
  IJoinLobbyData,
} from "../interfaces/ILobby";

import type { IGhostData } from "../interfaces/IGhostData";
import type {
  CollectionReference,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { LobbyState } from "@leaguematch/shared";
import { Player } from "../models/Player";
import { IUpdateGhost } from "../interfaces/IUpdateGhost";
import {
  hostAction,
  JoinerAction,
  selfAction,
} from "../transactions/actions/lobbyActions";

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
    if (!lobbyId) throw new Error.BadRequestError("Invalid lobbyId");
    if (!uid) throw new Error.BadRequestError("uid required");

    await selfAction({
      lobbyId,
      uid,
      action: (lobby) => {
        const updatedPlayers = lobby.players.map((p) => {
          if (!p) return p;

          if (p.uid === uid) {
            return new Player(
              p.uid,
              p.username,
              p.riotId,
              p.position,
              p.championId,
              !Boolean(p.ready),
              false
            ).toObject();
          }
          return p instanceof Player ? p.toObject() : p;
        });

        lobby.players = updatedPlayers;

        this.switchLobbyState(lobby);
      },
      states: [LobbyState.IDLE, LobbyState.FINISHED],
    });
  }

  async addGhost(lobbyId: string, hostId: string, ghostData: IGhostData) {
    await hostAction({
      lobbyId,
      uid: hostId,
      action: (lobby) => {
        const auto = `Ghost-${lobby.ghostCount}`;
        lobby.addPlayer(
          auto,
          auto,
          null,
          ghostData.position,
          ghostData.championId,
          true,
          ghostData.index
        );
      },
      states: [LobbyState.IDLE, LobbyState.FINISHED],
    });
  }

  async updateGhost(lobbyId: string, hostId: string, ghostData: IUpdateGhost) {
    await hostAction({
      lobbyId,
      uid: hostId,
      action: (lobby) => {
        lobby.updateGhostPosition(ghostData.ghostId, ghostData.position);
      },
      states: [LobbyState.IDLE, LobbyState.FINISHED],
    });
  }

  async initSearch(lobbyId: string, uid: string) {
    await hostAction({
      lobbyId,
      uid,
      action: (lobby) => {
        lobby.setState(LobbyState.SEARCHING);
      },
      states: [LobbyState.IDLE],
    });
  }

  async kickPlayer(lobbyId: string, hostId: string, targetUid: string) {
    await hostAction({
      lobbyId,
      uid: hostId,
      action: (lobby) => {
        lobby.removePlayer(targetUid, true);
        this.switchLobbyState(lobby);
      },
      states: [LobbyState.IDLE, LobbyState.FINISHED],
    });
  }

  async updateDiscord(lobbyId: string, hostId: string, discordLink: string) {
    await hostAction({
      lobbyId,
      uid: hostId,
      action: (lobby) => {
        lobby.updateDiscord(discordLink);
      },
      states: [LobbyState.IDLE, LobbyState.SEARCHING, LobbyState.FINISHED],
    });
  }

  async updateChampion(lobbyId: string, uid: string, championId: string) {
    await selfAction({
      lobbyId,
      uid,
      action: (lobby) => {
        lobby.players = lobby.players.map((p) =>
          p.uid === uid ? { ...p, championId } : p
        );
      },
      states: [LobbyState.IDLE, LobbyState.FINISHED],
    });
  }

  async getAvailableLobbies() {
    const snapshot = await this.lobbiesRef
      .where("state", "in", ["SEARCHING", "IDLE"])
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

    const user = await userService.getUserById(uid);
    if (!user) throw new Error.NotFoundError("User not found");

    let resultLobby: any = null;
    await JoinerAction({
      lobbyId,
      uid: playerData.uid,
      action: (lobby) => {
        lobby.addPlayer(uid, user.username, user.riotId, position, championId);
        this.switchLobbyState(lobby);
        resultLobby = { id: lobbyId, ...lobby.toFirestore() };
      },
      states: [LobbyState.SEARCHING, LobbyState.IDLE],
    });
    return resultLobby;
  }

  async leaveById(lobbyId: string, uid: string) {
    await selfAction({
      lobbyId,
      uid,
      action: (lobby) => {
        lobby.removePlayer(uid);
        this.switchLobbyState(lobby);
      },
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
    const currentPlayers = lobby.currentPlayers;
    switch (lobby.state) {
      case LobbyState.IDLE:
        if (
          currentPlayers === lobby.maxPlayers &&
          players.every((player) => player && player.ready)
        ) {
          lobby.setState(LobbyState.FINISHED);
        }
        break;
      case LobbyState.SEARCHING:
        if (currentPlayers === lobby.maxPlayers)
          lobby.setState(LobbyState.IDLE);
        break;
      case LobbyState.FINISHED:
        if (
          currentPlayers < lobby.maxPlayers ||
          !lobby.players.every((player) => player && player.ready)
        )
          lobby.setState(LobbyState.IDLE);
    }
  }
}

export const lobbyService = new LobbyService();
