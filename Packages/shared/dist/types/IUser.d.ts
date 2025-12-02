export interface IUser {
    username: string;
    email: string;
    puuid: string | null;
    riotId: string | null;
    rank: string | null;
    preferredRoles: string[];
}
