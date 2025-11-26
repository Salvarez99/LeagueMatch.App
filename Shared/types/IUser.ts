export interface User {
  email: string;
  preferredRoles: string[];
  puuid: string | null;
  rank: string | null;
  riotId: string | null;
  uid: string;
  username: string;
}