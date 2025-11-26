import ILobbyPlayer from "./ILobbyPlayer"

export interface Lobby {
  createdAt: string;
  currentPlayers: number;
  gameMap: string;
  gameMode: string;
  hostId: string;
  isActive: boolean;
  kickedPlayers: string[];
  players: ILobbyPlayer[];
}
