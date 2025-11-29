export interface ILobbyPlayer {
  uid: string;
  riotId: string;
  position: string | null;
  championId: string | null;
  ready: boolean;
}
