import type { ILobbyPlayer } from "./ILobbyPlayer";
import type { ILobbyFilter } from "./ILobbyFilter";

export interface ILobby {
  //may need to add lobbyId for api response in frontend
  createdAt: string;
  currentPlayers: number;
  gameMap: string;
  gameMode: string;
  hostId: string;
  isActive: boolean;
  kickedPlayers: string[];
  players: ILobbyPlayer[];
  filter: ILobbyFilter;
  maxPlayers: number;
}
