import { ILobbyPlayer } from "@leaguematch/shared";
export class Player implements ILobbyPlayer {
  constructor(
    public uid: string,
    public riotId: string,
    public position: string | null = null,
    public championId: string | null = null,
    public ready: boolean = false
  ) {}

  toObject(): ILobbyPlayer {
    return {
      uid: this.uid,
      riotId: this.riotId,
      position: this.position,
      championId: this.championId,
      ready: this.ready,
    };
  }
}
