export default interface LobbyPlayer {
  championId: string | null;
  position: string | null;
  ready: boolean;
  riotId: string;
  uid: string;
}
