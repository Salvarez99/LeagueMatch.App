import { IUser } from "@leaguematch/shared";
import { User } from "../models/User";
import { riotService } from "./riotService";
import { IRiotRankEntry, IRiotAccount } from "../interfaces/riot";
import * as Error from "../utils/AppError";
import { IUserData } from "../interfaces/IUserData";

import { db } from "../firebaseConfig";

export class UserService {
  private usersRef = db.collection("users");

  constructor() {}

  // Add a new user
  async addUser(userData: IUserData) {
    const user = new User(userData);

    if (!user.id || !user.username || !user.email) {
      throw new Error.BadRequestError("id, username, and email are required");
    }

    const userDoc = user.toJSON();
    await this.usersRef.doc(user.id).set(userDoc);

    return { ...userDoc };
  }

  // Get a user by UID
  async getUserById(uid: string) {
    const doc = await this.usersRef.doc(uid).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...(doc.data() as IUser) };
  }

  // Update user with Riot info
  async updateUser(id: string | null, username: string | null, riotId: string) {
    if (!riotId) throw new Error.UnauthorizedError("riotId is required");
    if (!id && !username)
      throw new Error.UnauthorizedError("Either id or username is required");

    let userRef;

    // Resolve Firestore reference
    if (id) {
      userRef = this.usersRef.doc(id);
    } else {
      const snapshot = await this.usersRef
        .where("username", "==", username)
        .limit(1)
        .get();

      if (snapshot.empty) throw new Error.NotFoundError("User not found");
      userRef = snapshot.docs[0].ref;
    }

    // Riot API calls
    const [gameName, tag] = riotId.split("#");

    const account: IRiotAccount = await riotService.getAccountByRiotId(
      gameName,
      tag
    );

    const puuid = account.puuid;

    const rankData: IRiotRankEntry[] = await riotService.getRankByPuuid(puuid);

    // Riot API returns an array of entries, sometimes empty for unranked
    const soloQueue = rankData.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );

    const rank = soloQueue ? `${soloQueue.tier} ${soloQueue.rank}` : "Unranked";

    await userRef.set({ riotId, puuid, rank }, { merge: true });

    const updatedSnap = await userRef.get();

    if (!updatedSnap.exists) {
      throw new Error.NotFoundError("User not found after update");
    }

    const updatedUser = updatedSnap.data();

    return {
      ...updatedUser,
    };
  }

  async acceptFriendRequest(uid: string, incomingUid: string) {
    if (!uid || !incomingUid)
      throw new Error.BadRequestError("Missing uid or incomingUid fields");

    const userDocRef = this.usersRef.doc(uid);
    const incomingUserDocRef = this.usersRef.doc(incomingUid);

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userDocRef);
      const incomingUserSnap = await tx.get(incomingUserDocRef);

      if (!userSnap.exists) throw new Error.NotFoundError("User not found");
      if (!incomingUserSnap.exists)
        throw new Error.NotFoundError("Incoming user not found");

      const user = User.fromFirestore(userSnap);
      const incomingUser = User.fromFirestore(incomingUserSnap);

      User.acceptIncomingRequest(user, incomingUser);

      tx.set(userDocRef, user.toJSON(), { merge: true });
      tx.set(incomingUserDocRef, incomingUser.toJSON(), { merge: true });
    });
  }
}

// Singleton export
export const userService = new UserService();
