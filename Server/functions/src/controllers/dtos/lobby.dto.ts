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

export type updateDiscordDTO = {
  discordLink: string;
};

export type findLobbyDTO = {
  gameMap: string;
  gameMode: string;
  desiredPosition: string;
  ranks: string[];
};

export type joinLobbyDTO = {
  uid: string;
  position?: string;
  championId?: string;
};
