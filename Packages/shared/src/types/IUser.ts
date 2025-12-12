import { Friend } from "./Friend";
import { FriendRequest } from "./FriendRequest";
export interface IUser {
  username: string;
  email: string;
  puuid: string | null;
  riotId: string | null;
  rank: string | null;
  preferredRoles: string[];
  friendsList: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
}
