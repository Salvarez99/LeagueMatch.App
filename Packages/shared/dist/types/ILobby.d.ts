import type { ILobbyPlayer } from "./ILobbyPlayer";
import type { ILobbyFilter } from "./ILobbyFilter";
export interface ILobby {
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
    discordLink?: string | null;
}
