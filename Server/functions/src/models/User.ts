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

  setRiotId(riotId: string) {
    this.riotId = riotId;
  }

  setPuuid(puuid: string) {
    this.puuid = puuid;
  }

  setRank(rank: string) {
    this.rank = rank;
  }

  static sendFriendRequest(user: User, target: User) {
    const alreadyFriends = user.friendsList.some(
      (friend) => target.id === friend.uid
    );

    const outgoingExists = user.outgoingRequests.some(
      (request) => target.id === request.uid
    );

    const incomingExists = user.incomingRequests.some(
      (request) => request.uid === target.id
    );

    const targetIncomingExists = target.incomingRequests.some(
      (request) => request.uid === user.id
    );

    const targetOutgoingExists = target.outgoingRequests.some(
      (request) => request.uid === user.id
    );

    if (
      alreadyFriends ||
      outgoingExists ||
      incomingExists ||
      targetIncomingExists ||
      targetOutgoingExists
    )
      return;

    target.incomingRequests.push({
      uid: user.id,
      username: user.username,
    } as FriendRequest);

    user.outgoingRequests.push({
      uid: target.id,
      username: target.username,
    } as FriendRequest);
  }

  static respondFriendRequest(
    user: User,
    incomingUser: User,
    accepted: boolean
  ) {
    const hasIncoming = user.incomingRequests.some(
      (req) => req.uid === incomingUser.id
    );

    if (!hasIncoming) {
      return;
    }

    user.incomingRequests = user.incomingRequests.filter(
      (req) => req.uid !== incomingUser.id
    );

    incomingUser.outgoingRequests = incomingUser.outgoingRequests.filter(
      (req) => req.uid !== user.id
    );

    if (!accepted) {
      return;
    }

    const alreadyFriends = user.friendsList.some(
      (friend) => friend.uid === incomingUser.id
    );

    if (alreadyFriends) {
      return;
    }

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
    user.availability = data.availability;
    user.statusMessage = data.statusMessage;

    return user;
  }

  toFirestore(): IUser {
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
