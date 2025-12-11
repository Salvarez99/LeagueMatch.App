import type { DocumentData } from "firebase-admin/firestore";
import type { ILobby } from "@leaguematch/shared";
import type { ILobbyFilter } from "@leaguematch/shared";
import type { ILobbyPlayer } from "@leaguematch/shared";
import { Player } from "./Player";
import { LobbyState } from "@leaguematch/shared";

export class Lobby implements ILobby {
  hostId: string;
  gameMap: string;
  gameMode: string;
  createdAt: string;
  updatedAt: string;
  currentPlayers: number;
  state: LobbyState;
  kickedPlayers: string[];
  players: (ILobbyPlayer | null)[];
  filter: ILobbyFilter;
  maxPlayers: number;
  ghostCount: number;
  discordLink: string | null;

  static mapPositions = {
    "Summoner's Rift": ["Top", "Jungle", "Middle", "Adc", "Support"],
  };

  constructor(
    hostId: string,
    username: string,
    riotId: string | null,
    gameMap: string,
    gameMode: string | null,
    hostPosition: string | null = null,
    championId: string | null = null,
    ranksFilter: string[] | null = [],
    ghostCount: number = 0
  ) {
    if (!hostId || !gameMap)
      throw new Error("hostId and gameMap are required21321312");

    this.hostId = hostId;
    this.gameMap = gameMap;
    this.gameMode = gameMode ?? "Unknown";
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    this.currentPlayers = 1;
    this.state = LobbyState.IDLE;
    this.kickedPlayers = [];
    this.discordLink = null;

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
      new Player(
        hostId,
        username,
        riotId,
        hostPosition,
        championId,
        false,
        false
      ),
    ];

    for (let i: number = 0; i < this.maxPlayers - 1; i++) {
      this.players.push(null);
    }
  }

  setState(state: LobbyState) {
    this.state = state;
  }

  // ➤ Add a player
  addPlayer(
    uid: string,
    username: string,
    riotId: string,
    position: string | null = null,
    championId: string | null = null,
    isGhost: boolean = false,
    slotIndex?: number
  ) {
    let ready = false;
    if (isGhost) {
      this.ghostCount++;
      ready = !ready;
    }

    if (this.players.some((p) => p && p.uid === uid))
      throw new Error("Player already in lobby");

    if (this.currentPlayers >= this.maxPlayers)
      throw new Error("Lobby is full");

    switch (this.gameMap) {
      case "Summoner's Rift":
        if (!position) throw new Error("position required for SR");

        if (!isGhost && !championId)
          throw new Error("championId required for SR");

        if (!this.filter.positionsNeeded.includes(position)) {
          throw new Error(`Position ${position} no longer available`);
        }

        this.filter.positionsNeeded = this.filter.positionsNeeded.filter(
          (p) => p !== position
        );
        break;

      case "Aram":
        this.players.push(
          new Player(uid, username, riotId, null, null, ready, isGhost)
        );
        break;

      case "Featured Modes":
        if (!isGhost && !championId)
          throw new Error("championId required for Featured Modes");
        // this.players.push(
        //   new Player(uid, username, riotId, null, championId, ready, isGhost)
        // );
        break;
    }

    let index = -1;
    if (slotIndex) {
      index = slotIndex;
    } else index = this.players.findIndex((p) => p === null);
    
    console.log(index);
    if (index === -1) throw new Error("Lobby is full");
    this.players[index] = new Player(
      uid,
      username,
      riotId,
      position,
      championId,
      ready,
      isGhost
    );
    this.currentPlayers++;
  }

  // ➤ Remove a player
  removePlayer(uid: string, kicked = false) {
    if (uid === this.hostId) {
      this.players = [];
      this.state = LobbyState.CLOSED;
      this.currentPlayers = 0;
      this.kickedPlayers = [];
      this.filter.positionsNeeded = [];
      return;
    }
    const index = this.players.findIndex((p) => p && p.uid === uid);
    if (index === -1) throw new Error("Player not found");
    const removed = this.players[index];

    this.players[index] = null;
    this.currentPlayers--;

    if (this.gameMap === "Summoner's Rift" && removed.position) {
      if (!this.filter.positionsNeeded.includes(removed.position)) {
        this.filter.positionsNeeded.push(removed.position);
      }
    }

    if (removed && !removed.isGhost && kicked) this.kickedPlayers.push(uid);
    else this.ghostCount--;
  }

  updateGhostPosition(ghostId: string, newPostion: string) {
    const index = this.players.findIndex((p) => p.uid === ghostId);
    const ghost = this.players[index];
    if (!this.filter.positionsNeeded.includes(newPostion)) {
      throw new Error(`Position ${newPostion} no longer available`);
    }
    if (this.gameMap === "Summoner's Rift" && ghost.position) {
      if (!this.filter.positionsNeeded.includes(ghost.position)) {
        this.filter.positionsNeeded.push(ghost.position);
      }
    }
    this.filter.positionsNeeded = this.filter.positionsNeeded.filter(
      (p) => p !== newPostion
    );
    ghost.position = newPostion;
  }

  updateDiscord(link: string) {
    this.discordLink = link;
  }
  // ➤ Prepare Firestore object
  toFirestore(): ILobby {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      currentPlayers: this.currentPlayers,
      gameMap: this.gameMap,
      gameMode: this.gameMode,
      hostId: this.hostId,
      state: this.state,
      kickedPlayers: this.kickedPlayers,
      players: this.players.map((p) =>
        p instanceof Player ? p.toObject() : p
      ),
      filter: this.filter,
      ghostCount: this.ghostCount ?? 0,
      maxPlayers: this.maxPlayers,
      discordLink: this.discordLink,
    };
  }

  static fromFirestore(data: DocumentData): Lobby {
    const lobby = Object.create(Lobby.prototype) as Lobby;

    // Assign fields WITHOUT running constructor logic
    lobby.hostId = data.hostId;
    lobby.gameMap = data.gameMap;
    lobby.gameMode = data.gameMode;
    lobby.createdAt = data.createdAt;
    lobby.updatedAt = data.updatedAt;
    lobby.currentPlayers = data.currentPlayers;
    lobby.state = data.state;
    lobby.kickedPlayers = data.kickedPlayers ?? [];
    lobby.filter = data.filter;
    lobby.maxPlayers = data.maxPlayers;
    lobby.ghostCount = data.ghostCount ?? 0;
    lobby.discordLink = data.discordLink ?? null;

    lobby.players = (data.players ?? []).map((p: ILobbyPlayer) => {
      if (!p) return null;
      else
        return new Player(
          p.uid,
          p.username,
          p.riotId,
          p.position ?? null,
          p.championId ?? null,
          p.ready ?? false,
          p.isGhost ?? false
        );
    });

    return lobby;
  }
}
