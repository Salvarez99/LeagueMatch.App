import type { DocumentData } from "firebase-admin/firestore";
import type { ILobby } from "@leaguematch/shared";
import type { ILobbyFilter } from "@leaguematch/shared";
import type { ILobbyPlayer } from "@leaguematch/shared";
import { Player } from "./Player";

export class Lobby implements ILobby {
  hostId: string;
  gameMap: string;
  gameMode: string;
  createdAt: string;
  currentPlayers: number;
  isActive: boolean;
  kickedPlayers: string[];
  players: ILobbyPlayer[];
  filter: ILobbyFilter;
  maxPlayers: number;

  static mapPositions = {
    "Summoner's Rift": ["Top", "Jungle", "Middle", "Adc", "Support"],
  };

  constructor(
    hostId: string,
    riotId: string,
    gameMap: string,
    gameMode: string | null,
    hostPosition: string | null = null,
    championId: string | null = null,
    ranksFilter: string[] | null = []
  ) {
    if (!hostId || !gameMap) throw new Error("hostId and gameMap are required");

    this.hostId = hostId;
    this.gameMap = gameMap;
    this.gameMode = gameMode ?? "Unknown";
    this.createdAt = new Date().toISOString();
    this.currentPlayers = 1;
    this.isActive = true;
    this.kickedPlayers = [];

    switch (gameMap) {
      case "Summoner's Rift": {
        if (!gameMode) throw new Error("gameMode required for SR");
        if (!hostPosition) throw new Error("hostPosition required for SR");
        if (!championId) throw new Error("championId required for SR");

        this.maxPlayers =
          gameMode === "Ranked Solo/Duo"
            ? 2
            : Lobby.mapPositions[gameMap].length;

        const positions = Lobby.mapPositions["Summoner's Rift"];
        const positionsNeeded = positions.filter((p) => p !== hostPosition);

        this.filter = {
          ranksFilter: ranksFilter ?? [],
          positionsNeeded,
        };
        break;
      }

      case "Aram":
        if (!gameMode) throw new Error("gameMode required for Aram");
        this.maxPlayers = 5;
        this.filter = {
          ranksFilter: ranksFilter ?? [],
          positionsNeeded: [],
        };
        break;

      case "Featured Modes":
        if (!gameMode) throw new Error("gameMode required for Featured Modes");
        if (!championId)
          throw new Error("championId required for Featured Modes");

        this.maxPlayers = gameMode === "Arena" ? 2 : 5;
        this.filter = {
          ranksFilter: ranksFilter ?? [],
          positionsNeeded: [],
        };
        break;

      default:
        throw new Error(`Unsupported map: ${gameMap}`);
    }

    // Initialize host player
    this.players = [
      new Player(hostId, riotId, hostPosition, championId, false),
    ];
  }

  // ➤ Add a player
  addPlayer(
    uid: string,
    riotId: string,
    position: string | null = null,
    championId: string | null = null
  ) {
    if (this.players.some((p) => p.uid === uid))
      throw new Error("Player already in lobby");

    if (this.currentPlayers >= this.maxPlayers)
      throw new Error("Lobby is full");

    switch (this.gameMap) {
      case "Summoner's Rift":
        if (!position) throw new Error("position required for SR");
        if (!championId) throw new Error("championId required for SR");

        if (!this.filter.positionsNeeded.includes(position)) {
          throw new Error(`Position ${position} no longer available`);
        }

        this.players.push(new Player(uid, riotId, position, championId));
        this.filter.positionsNeeded = this.filter.positionsNeeded.filter(
          (p) => p !== position
        );
        break;

      case "Aram":
        this.players.push(new Player(uid, riotId, null, null));
        break;

      case "Featured Modes":
        if (!championId)
          throw new Error("championId required for Featured Modes");
        this.players.push(new Player(uid, riotId, null, championId));
        break;
    }

    this.currentPlayers++;
    this.isActive = this.currentPlayers < this.maxPlayers;
  }

  // ➤ Remove a player
  removePlayer(uid: string, kicked = false) {
    if (uid === this.hostId) {
      this.isActive = false;
      this.players = [];
      this.currentPlayers = 0;
      this.kickedPlayers.push(uid);
      this.filter.positionsNeeded = [];
      return;
    }

    const index = this.players.findIndex((p) => p.uid === uid);
    if (index === -1) throw new Error("Player not found");

    const removed = this.players.splice(index, 1)[0];
    this.currentPlayers = Math.max(0, this.currentPlayers - 1);

    if (this.gameMap === "Summoner's Rift" && removed.position) {
      if (!this.filter.positionsNeeded.includes(removed.position)) {
        this.filter.positionsNeeded.push(removed.position);
      }
    }

    if (kicked) this.kickedPlayers.push(uid);

    this.isActive = this.currentPlayers < this.maxPlayers;
  }

  // ➤ Prepare Firestore object
  toFirestore(): ILobby {
    return {
      createdAt: this.createdAt,
      currentPlayers: this.currentPlayers,
      gameMap: this.gameMap,
      gameMode: this.gameMode,
      hostId: this.hostId,
      isActive: this.isActive,
      kickedPlayers: this.kickedPlayers,
      players: this.players,
      filter: this.filter,
      maxPlayers: this.maxPlayers,
    };
  }

  // ➤ Rehydrate Lobby from Firestore
  static fromFirestore(data: DocumentData): Lobby {
    const host = data.players?.[0];

    const lobby = new Lobby(
      data.hostId,
      host?.riotId ?? "Unknown",
      data.gameMap,
      data.gameMode,
      host?.position ?? null,
      host?.championId ?? null,
      data.filter?.ranksFilter ?? []
    );

    lobby.players = (data.players ?? []).map(
      (p: ILobbyPlayer) =>
        new Player(p.uid, p.riotId, p.position ?? null, p.championId ?? null, p.ready)
    );

    lobby.maxPlayers = data.maxPlayers ?? lobby.maxPlayers;
    lobby.kickedPlayers = data.kickedPlayers ?? [];
    lobby.isActive = data.isActive ?? true;
    lobby.filter = data.filter ?? lobby.filter;

    return lobby;
  }
}
