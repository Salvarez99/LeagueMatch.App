const fetch = require("node-fetch");

class RiotService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.RIOT_API_KEY;
  }

  async getAccountByRiotId(gameName, tag) {
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

    return response.json();
  }

  async getRankByPuuid(puuid) {
    const baseUrl = "https://na1.api.riotgames.com";
    const url = `${baseUrl}/lol/league/v4/entries/by-puuid/${puuid}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": this.apiKey },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Riot rank data (${response.status})`);
    }

    return response.json();
  }
}

// Export a singleton instance
module.exports = new RiotService();
