export interface ILobbyPlayer {
  uid: string;
  riotId: string | null;
  position: string | null;
  championId: string | null;
  ready: boolean;
}
