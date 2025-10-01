const fetch = require("node-fetch");
const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function getAccountByRiotId(gameName, tag){
    const baseUrl = "https://americas.api.riotgames.com";
    const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;

    const response = await fetch(url, {
        headers : { "X-Riot-Token": RIOT_API_KEY},
    });

    if(!response.ok){
        throw new Error(`Failed to fetch Riot Account data (${response.status}, ${gameName}#${tag})`)
    }

    return response.json();
}

async function getRankByPuuid(puuid){
    const baseUrl = "https://na1.api.riotgames.com";
    const url = `${baseUrl}/lol/league/v4/entries/by-puuid/${puuid}`;

    const response = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_API_KEY },
    });

    if (!response.ok) {
    throw new Error(`Failed to fetch Riot rank data (${response.status})`);
    }

    return response.json();    
}

module.exports = { getAccountByRiotId, getRankByPuuid};