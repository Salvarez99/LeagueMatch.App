export interface IRiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface IRiotRankEntry {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
}
