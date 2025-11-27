import { ILobbyPlayer } from "@leaguematch/shared";
export class Player implements ILobbyPlayer {
  constructor(
    public uid: string,
    public riotId: string,
    public position: string | null = null,
    public championId: string | null = null,
    public ready: boolean = false
  ) {}
}
