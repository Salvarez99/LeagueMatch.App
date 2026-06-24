import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { IRiotAccount, IRiotRankEntry } from "../../interfaces/riot";

dotenv.config();

@Injectable()
export class RiotService {
  apiKey: string;

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || process.env.RIOT_KEY || "";
  }

  async getAccountByRiotId(
    gameName: string,
    tag: string,
  ): Promise<IRiotAccount> {
    console.log(
      `[RiotService] Looking up account for gameName=${gameName}, tag=${tag}`,
    );

    if (!this.apiKey) {
      throw new HttpException(
        "Riot API key is not configured",
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const baseUrl = "https://americas.api.riotgames.com";
    const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tag)}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": this.apiKey },
    });

    if (!response.ok) {
      const responseText = await response.text();

      if (response.status === 404) {
        throw new HttpException(
          `Riot account not found for ${gameName}#${tag}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const message =
        response.status === 401 || response.status === 403
          ? "Riot API key is invalid or expired"
          : `Failed to fetch Riot Account data (${response.status}, ${gameName}#${tag}): ${responseText}`;

      throw new HttpException(message, HttpStatus.BAD_GATEWAY);
    }

    return response.json() as Promise<IRiotAccount>;
  }

  async getRankByPuuid(puuid: string): Promise<IRiotRankEntry[]> {
    if (!this.apiKey) {
      throw new HttpException(
        "Riot API key is not configured",
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const baseUrl = "https://na1.api.riotgames.com";
    const url = `${baseUrl}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;

    const response = await fetch(url, {
      headers: { "X-Riot-Token": this.apiKey },
    });

    if (!response.ok) {
      const responseText = await response.text();
      const message =
        response.status === 401 || response.status === 403
          ? "Riot API key is invalid or expired"
          : `Failed to fetch Riot rank data (${response.status}): ${responseText}`;

      throw new HttpException(message, HttpStatus.BAD_GATEWAY);
    }

    return response.json() as Promise<IRiotRankEntry[]>;
  }
}
