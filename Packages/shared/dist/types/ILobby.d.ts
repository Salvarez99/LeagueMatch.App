import type { ILobbyPlayer } from "./ILobbyPlayer";
export interface ILobby {
    createdAt: string;
    currentPlayers: number;
    gameMap: string;
    gameMode: string;
    hostId: string;
    isActive: boolean;
    kickedPlayers: string[];
    players: ILobbyPlayer[];
}
