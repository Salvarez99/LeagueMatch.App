export interface Create {
  hostId: string;
  gameMap: string;
  gameMode?: string | null;
  hostPosition?: string | null;
  championId?: string | null;
  rankFilter: string[];
}

export interface Find {
  gameMap: string;
  gameMode: string;
  desiredPosition?: string | null;
  ranks: string[];
}

export interface Join {
  uid: string;
  position?: string | null;
  championId?: string | null;
}

export interface UpdateChampion {
  championId: string;
}

export interface Kick {
  uid: string;
}
