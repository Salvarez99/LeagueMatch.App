export interface IUser {
  uid: string;
  username: string;
  email: string;
  puuid: string | null;
  riotId: string | null;
  rank: string | null;
  preferredRoles: string[];
}