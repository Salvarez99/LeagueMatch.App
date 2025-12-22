// interfaces/ILobbyCreateData.ts
export type ILobbyCreateData = {
  hostId: string;
  gameMap: string;
  gameMode?: string | null;
  hostPosition?: string | null;
  championId?: string | null;
  rankFilter?: string[];
}

// interfaces/IFindLobbyData.ts
export type IFindLobbyData = {
  gameMap: string;
  gameMode: string;
  desiredPosition?: string;
  ranks?: string[];
  uid: string;
}

// interfaces/IJoinLobbyData.ts
export type IJoinLobbyData = {
  uid: string;
  position?: string | null;
  championId?: string | null;
}
