export type createLobbyRequestDTO = {
  hostId: string;
  gameMap: string;
  gameMode?: string;
  hostPosition?: string | null;
  championId?: string | null;
  rankFilter?: string[];
};

export type updateGhostDTO = {
  ghostId: string;
  position: string;
  championId?: string;
};
