export interface ILobbyPlayer {
    uid: string;
    username: string;
    riotId: string | null;
    position: string | null;
    championId: string | null;
    ready: boolean;
}
