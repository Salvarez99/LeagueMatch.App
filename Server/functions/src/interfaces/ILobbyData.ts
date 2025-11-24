import { IPlayerData } from "./IPlayerData";
import { ILobbyFilter } from "./ILobbyFilter";

export interface ILobbyData {
  // id:string;
  hostId: string;
  riotId: string;
  gameMap: string;
  gameMode: string;
  kickedPlayers: string[];
  currentPlayers: number;
  maxPlayers: number;
  createdAt: string;
  isActive: boolean;
  filter: ILobbyFilter;
  players: IPlayerData[];
}

/*
{
  "id": "ztnYK23nWHT6E4iu5rU8",
  "hostId": "1",
  "gameMap": "Summoner's Rift",
  "gameMode": "Swift Play",
  "kickedPlayers": [],
  "currentPlayers": 1,
  "createdAt": "2025-11-24T17:33:44.520Z",
  "isActive": true,
  "maxPlayers": 5,
  "filter": {
      "ranksFilter": [],
      "positionsNeeded": [
          "Top",
          "Jungle",
          "Adc",
          "Support"
      ]
  },
  "players": [
      {
          "uid": "1",
          "riotId": "ピーチ#NA01",
          "position": "Middle",
          "championId": "Nidalee",
          "ready": false
      }
  ]
}
*/