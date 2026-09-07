import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as path from "path";
import { IRiotAccount, IRiotRankEntry } from "../../interfaces/riot";

const functionsEnv = dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  override: true,
}).parsed;

@Injectable()
export class RiotService {
  apiKey: string;

  constructor() {
    this.apiKey =
      functionsEnv?.RIOT_KEY ||
      functionsEnv?.RIOT_API_KEY ||
      process.env.RIOT_KEY ||
      process.env.RIOT_API_KEY ||
      "";
  }

  private throwUpstreamError(
    operation: string,
    status: number,
    subject: string,
  ): never {
    if (status === 401 || status === 403) {
      throw new HttpException(
        {
          message: `Riot rejected the ${operation} request. The server Riot API key may be invalid or expired.`,
          code: "RIOT_AUTH_FAILED",
          details: `Riot returned HTTP ${status} while ${operation} for ${subject}.`,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (status === 429) {
      throw new HttpException(
        {
          message:
            "Riot rate-limited the request. Wait a moment and try again.",
          code: "RIOT_RATE_LIMITED",
          details: `Riot returned HTTP 429 during ${operation}.`,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    throw new HttpException(
      {
        message: `Riot could not complete the ${operation} request. Verify the Riot ID and try again later.`,
        code:
          operation === "account lookup"
            ? "RIOT_ACCOUNT_LOOKUP_FAILED"
            : "RIOT_RANK_LOOKUP_FAILED",
        details: `Riot returned HTTP ${status} during ${operation} for ${subject}.`,
      },
      HttpStatus.BAD_GATEWAY,
    );
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

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "X-Riot-Token": this.apiKey },
      });
    } catch (error) {
      console.error("[RiotService] Account lookup request failed", error);
      throw new HttpException(
        {
          message:
            "The server could not reach Riot's account service. Check the backend network connection and try again.",
          code: "RIOT_ACCOUNT_SERVICE_UNREACHABLE",
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new HttpException(
          {
            message: `Riot account not found for ${gameName}#${tag}. Check the spelling and tagline.`,
            code: "RIOT_ACCOUNT_NOT_FOUND",
          },
          HttpStatus.NOT_FOUND,
        );
      }
      this.throwUpstreamError(
        "account lookup",
        response.status,
        `${gameName}#${tag}`,
      );
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

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "X-Riot-Token": this.apiKey },
      });
    } catch (error) {
      console.error("[RiotService] Rank lookup request failed", error);
      throw new HttpException(
        {
          message:
            "The server could not reach Riot's ranked-data service. Check the backend network connection and try again.",
          code: "RIOT_RANK_SERVICE_UNREACHABLE",
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!response.ok) {
      this.throwUpstreamError(
        "rank lookup",
        response.status,
        "the linked account",
      );
    }

    return response.json() as Promise<IRiotRankEntry[]>;
  }
}
