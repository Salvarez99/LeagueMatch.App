export interface IPlayerData {
  uid: string;
  riotId: string;
  position? : string | null;
  championId?: string | null;
  ready: boolean;
}

/*
{
  "uid": "1",
  "riotId": "ピーチ#NA01",
  "position": "Middle",
  "championId": "Nidalee",
  "ready": false
}
*/
