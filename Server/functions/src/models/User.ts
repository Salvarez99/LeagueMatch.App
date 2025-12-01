import { IUser } from "@leaguematch/shared";
import { IUserData } from "../interfaces/IUserData";

export class User implements IUserData{
  id: string;
  username: string;
  email: string;
  puuid: string | null;
  riotId: string | null;
  rank: string | null;
  preferredRoles: string[];

  constructor(data: IUserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;

    // Use nullish coalescing to avoid undefined overwriting defaults
    this.puuid = data.puuid ?? null;
    this.riotId = data.riotId ?? null;
    this.rank = data.rank ?? null;
    this.preferredRoles = data.preferredRoles ?? [];
  }

  toJSON() {
    return {
      username: this.username,
      email: this.email,
      puuid: this.puuid,
      riotId: this.riotId,
      rank: this.rank,
      preferredRoles: this.preferredRoles,
    };
  }
}
