export class RiotService {
    constructor(apiKey) {
        var _a;
        this.apiKey = (_a = apiKey !== null && apiKey !== void 0 ? apiKey : process.env.RIOT_API_KEY) !== null && _a !== void 0 ? _a : "";
    }
    async getAccountByRiotId(gameName, tag) {
        const baseUrl = "https://americas.api.riotgames.com";
        const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;
        const response = await fetch(url, {
            headers: { "X-Riot-Token": this.apiKey },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch Riot Account data (${response.status}, ${gameName}#${tag})`);
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
// Singleton export
export const riotService = new RiotService();
