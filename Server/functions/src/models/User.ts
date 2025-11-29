import { IUser } from "@leaguematch/shared";

export class User {
  uid: string;
  username: string;
  email: string;
  puuid: string | null;
  riotId: string | null;
  rank: string | null;
  preferredRoles: string[];

  constructor(data: IUser) {
    this.uid = data.uid;
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
      uid: this.uid,
      username: this.username,
      email: this.email,
      puuid: this.puuid,
      riotId: this.riotId,
      rank: this.rank,
      preferredRoles: this.preferredRoles,
    };
  }
}
