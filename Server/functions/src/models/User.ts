import { Friend, FriendRequest, IUser } from "@leaguematch/shared";
import { IUserData } from "../interfaces/IUserData";
import { stat } from "fs";

export class User implements IUserData {
  id: string;
  username: string;
  email: string;
  puuid: string | null;
  riotId: string | null;
  rank: string | null;
  preferredRoles: string[];
  friendsList: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  availability: "Online" | "Away" | "Offline";
  statusMessage: string;

  constructor(data: IUserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;

    // Use nullish coalescing to avoid undefined overwriting defaults
    this.puuid = data.puuid ?? null;
    this.riotId = data.riotId ?? null;
    this.rank = data.rank ?? null;
    this.preferredRoles = data.preferredRoles ?? [];
    this.friendsList = [];
    this.incomingRequests = [];
    this.outgoingRequests = [];
  }

  static acceptIncomingRequest(user: User, incomingUser: User) {
    const index = user.incomingRequests.findIndex(
      (friend) => friend.uid === user.id
    );
    if (index === -1)
      throw new Error("Friend uid not found in incomingRequests");

    user.incomingRequests = user.incomingRequests.filter(
      (friend) => friend.uid !== incomingUser.id
    );

    const newFriend: Friend = {
      username: incomingUser.username,
      uid: incomingUser.id,
      availability: incomingUser.availability,
      statusMessage: incomingUser.statusMessage,
    };
    user.friendsList.push(newFriend);
  }

  toJSON() {
    return {
      username: this.username,
      email: this.email,
      puuid: this.puuid,
      riotId: this.riotId,
      rank: this.rank,
      preferredRoles: this.preferredRoles,
      friendsList: this.friendsList,
      incomingRequests: this.incomingRequests,
      outgoingRequests: this.outgoingRequests,
      availability: this.availability,
      statusMessage: this.statusMessage,
    };
  }
}
