import type { DocumentData } from "firebase-admin/firestore";
import type { ILobby } from "../../../../Packages/Shared/src/types/ILobby";
import type { ILobbyFilter } from "../interfaces/ILobbyFilter";
import type { ILobbyPlayer } from "../../../../Packages/Shared/src/types/ILobbyPlayer";

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

  constructor(params: {
    hostId: string;
    riotId: string;
    gameMap: string;
    gameMode: string | null;
    hostPosition?: string | null;
    championId?: string | null;
    ranksFilter?: string[];
  }) {
    const {
      hostId,
      riotId,
      gameMap,
      gameMode,
      hostPosition = null,
      championId = null,
      ranksFilter = [],
    } = params;

    if (!hostId || !gameMap) throw new Error("hostId and gameMap are required");

    this.hostId = hostId;
    this.gameMap = gameMap;
    this.gameMode = gameMode || "Unknown";
    this.createdAt = new Date().toISOString();
    this.currentPlayers = 1;
    this.isActive = true;
    this.kickedPlayers = [];

    // Configure game modes
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
          ranksFilter,
          positionsNeeded,
        };
        break;
      }

      case "Aram":
        if (!gameMode) throw new Error("gameMode required for Aram");
        this.maxPlayers = 5;
        this.filter = {
          ranksFilter,
          positionsNeeded: [],
        };
        break;

      case "Featured Modes":
        if (!gameMode) throw new Error("gameMode required for Featured Modes");
        if (!championId)
          throw new Error("championId required for Featured Modes");
        this.maxPlayers = gameMode === "Arena" ? 2 : 5;
        this.filter = {
          ranksFilter,
          positionsNeeded: [],
        };
        break;

      default:
        throw new Error(`Unsupported map: ${gameMap}`);
    }

    // Initialize players array (host is always first)
    this.players = [
      {
        uid: hostId,
        riotId,
        position: hostPosition,
        championId,
        ready: false,
      },
    ];
  }

  // ➤ Add a player to the lobby
  addPlayer(
    uid: string,
    riotId: string,
    position: string | null = null,
    championId: string | null = null
  ) {
    if (this.players.some((p) => p.uid === uid)) {
      throw new Error("Player already in lobby");
    }

    if (this.currentPlayers >= this.maxPlayers) {
      throw new Error("Lobby is full");
    }

    switch (this.gameMap) {
      case "Summoner's Rift":
        if (!position) throw new Error("position required for SR");
        if (!championId) throw new Error("championId required for SR");

        if (!this.filter.positionsNeeded.includes(position)) {
          throw new Error(`Position ${position} no longer available`);
        }

        this.players.push({ uid, riotId, position, championId, ready: false });
        this.filter.positionsNeeded = this.filter.positionsNeeded.filter(
          (p) => p !== position
        );
        break;

      case "Aram":
        this.players.push({
          uid,
          riotId,
          position: null,
          championId: null,
          ready: false,
        });
        break;

      case "Featured Modes":
        if (!championId)
          throw new Error("championId required for Featured Modes");
        this.players.push({
          uid,
          riotId,
          position: null,
          championId,
          ready: false,
        });
        break;
    }

    this.currentPlayers++;

    this.isActive = this.currentPlayers < this.maxPlayers;
  }

  // ➤ Remove a player
  removePlayer(uid: string, kicked: boolean = false) {
    if (uid === this.hostId) {
      // Closing lobby if host leaves
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

  // ➤ Prepare object for Firestore
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
    };
  }

  // ➤ Rehydrate class instance from Firestore
  static fromFirestore(data: DocumentData): Lobby {
    const lobby = new Lobby({
      hostId: data.hostId,
      riotId: data.players?.[0]?.riotId ?? "Unknown",
      gameMap: data.gameMap,
      gameMode: data.gameMode,
      hostPosition: data.players?.[0]?.position ?? null,
      championId: data.players?.[0]?.championId ?? null,
      ranksFilter: data.filter?.ranksFilter ?? [],
    });

    // overwrite properties
    lobby.players = data.players ?? [];
    lobby.maxPlayers = data.maxPlayers ?? lobby.maxPlayers;
    lobby.kickedPlayers = data.kickedPlayers ?? [];
    lobby.isActive = data.isActive ?? true;
    lobby.filter = data.filter ?? lobby.filter;

    return lobby;
  }
}
