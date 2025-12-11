import type { ILobbyPlayer } from "./ILobbyPlayer";
import type { ILobbyFilter } from "./ILobbyFilter";
import type { LobbyState } from "./LobbyState";
export interface ILobby {
    createdAt: string;
    updatedAt: string;
    currentPlayers: number;
    gameMap: string;
    gameMode: string;
    hostId: string;
    state: LobbyState;
    kickedPlayers: string[];
    players: (ILobbyPlayer | null)[];
    filter: ILobbyFilter;
    ghostCount: number;
    maxPlayers: number;
    discordLink: string | null;
}
