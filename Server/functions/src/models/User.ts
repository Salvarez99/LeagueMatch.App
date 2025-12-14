import { Friend, FriendRequest, IUser } from "@leaguematch/shared";
import { IUserData } from "../interfaces/IUserData";
import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";

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
    this.availability = "Online";
    this.statusMessage = "";
  }

  static acceptIncomingRequest(user: User, incomingUser: User) {
    const index = user.incomingRequests.findIndex(
      (friend) => friend.uid === incomingUser.id
    );
    if (index === -1)
      throw new Error("Friend uid not found in incomingRequests");

    user.incomingRequests = user.incomingRequests.filter(
      (friend) => friend.uid !== incomingUser.id
    );

    incomingUser.outgoingRequests = incomingUser.outgoingRequests.filter(
      (req) => req.uid !== user.id
    );
    
    const newFriend: Friend = {
      username: incomingUser.username,
      uid: incomingUser.id,
      availability: incomingUser.availability,
      statusMessage: incomingUser.statusMessage,
    };

    const userAsFriend: Friend = {
      username: user.username,
      uid: user.id,
      availability: user.availability,
      statusMessage: user.statusMessage,
    };

    user.friendsList.push(newFriend);
    incomingUser.friendsList.push(userAsFriend);
  }

  static fromFirestore(snap: DocumentSnapshot): User {
    const data = snap.data();
    const user = Object.create(User.prototype) as User;

    // Assign fields WITHOUT running constructor logic
    user.id = snap.id;
    user.username = data.username;
    user.email = data.email;
    user.puuid = data.puuid;
    user.riotId = data.riotId;
    user.rank = data.rank;
    user.preferredRoles = data.preferredRoles;
    user.friendsList = data.friendsList;
    user.incomingRequests = data.incomingRequests;
    user.outgoingRequests = data.outgoingRequests;
    user.statusMessage = data.statusMessage;

    return user;
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
