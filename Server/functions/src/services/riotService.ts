import { IRiotAccount, IRiotRankEntry } from "../interfaces/riot";

export class RiotService {
  apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.RIOT_API_KEY ?? "";
  }

  async getAccountByRiotId(gameName: string, tag: string): Promise<IRiotAccount> {
    const baseUrl = "https://americas.api.riotgames.com";
    const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": this.apiKey },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Riot Account data (${response.status}, ${gameName}#${tag})`
      );
    }

    return response.json() as Promise<IRiotAccount>;
  }

  async getRankByPuuid(puuid: string): Promise<IRiotRankEntry[]> {
    const baseUrl = "https://na1.api.riotgames.com";
    const url = `${baseUrl}/lol/league/v4/entries/by-puuid/${puuid}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": this.apiKey },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Riot rank data (${response.status})`);
    }

    return response.json() as Promise<IRiotRankEntry[]>;
  }
}

// Singleton export
export const riotService = new RiotService();
