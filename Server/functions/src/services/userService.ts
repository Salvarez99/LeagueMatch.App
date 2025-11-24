import { IUserData } from "../interfaces/IUserData";
import { User } from "../models/User";
import { riotService } from "./riotService";
import { IRiotRankEntry, IRiotAccount } from "../interfaces/riot";

import { db } from "../firebaseConfig";

export class UserService {
  private usersRef = db.collection("users");

  constructor() {}

  // Add a new user
  async addUser(userData: IUserData) {
    const user = new User(userData);

    if (!user.uid || !user.username || !user.email) {
      throw new Error("uid, username, and email are required");
    }

    const userDoc = user.toJSON();
    await this.usersRef.doc(user.uid).set(userDoc);

    return { id: user.uid, ...userDoc };
  }

  // Get a user by UID
  async getUserById(uid: string) {
    const doc = await this.usersRef.doc(uid).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...(doc.data() as IUserData) };
  }

  // Update user with Riot info
  async updateUser(
    uid: string | null,
    username: string | null,
    riotId: string
  ) {
    if (!riotId) throw new Error("riotId is required");
    if (!uid && !username)
      throw new Error("Either uid or username is required");

    let userRef;

    // Resolve Firestore reference
    if (uid) {
      userRef = this.usersRef.doc(uid);
    } else {
      const snapshot = await this.usersRef
        .where("username", "==", username)
        .limit(1)
        .get();

      if (snapshot.empty) throw new Error("User not found");
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

    return { uid: userRef.id, riotId, puuid, rank };
  }
}

// Singleton export
export const userService = new UserService();
