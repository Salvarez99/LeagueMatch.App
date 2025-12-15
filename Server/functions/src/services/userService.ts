import { IUser } from "@leaguematch/shared";
import { User } from "../models/User";
import { riotService } from "./riotService";
import { IRiotRankEntry, IRiotAccount } from "../interfaces/riot";
import * as Error from "../utils/AppError";
import { IUserData } from "../interfaces/IUserData";

import { db } from "../firebaseConfig";
import { UserAction } from "../transactions/actions/userAction";
import { UserPairAction } from "../transactions/actions/userPairAction";

export class UserService {
  private usersRef = db.collection("users");

  constructor() {}

  // Add a new user
  async addUser(userData: IUserData) {
    const user = new User(userData);

    if (!user.id || !user.username || !user.email) {
      throw new Error.BadRequestError("id, username, and email are required");
    }

    const userDoc = user.toFirestore();
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
  async updateUser(uid: string, riotId: string) {
    if (!uid) {
      throw new Error.UnauthorizedError("uid is required");
    }

    if (!riotId) {
      throw new Error.BadRequestError("riotId is required");
    }

    // 1️⃣ Resolve Riot data OUTSIDE the transaction
    const [gameName, tag] = riotId.split("#");

    if (!gameName || !tag) {
      throw new Error.BadRequestError("riotId must be in the format name#tag");
    }

    const account = await riotService.getAccountByRiotId(gameName, tag);
    const rankData = await riotService.getRankByPuuid(account.puuid);

    const soloQueue = rankData.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );

    const rank = soloQueue ? `${soloQueue.tier} ${soloQueue.rank}` : "Unranked";

    // 2️⃣ Transactionally update the user
    const updatedUser = await UserAction({
      uid,
      action: (user) => {
        user.setRiotId(riotId);
        user.setPuuid(account.puuid);
        user.setRank(rank);
        return user;
      },
    });

    // 3️⃣ Return canonical data
    return updatedUser.toFirestore();
  }

  async acceptFriendRequest(uid: string, incomingUid: string) {
    if (!uid || !incomingUid)
      throw new Error.BadRequestError("Missing uid or incomingUid fields");

    UserPairAction({
      uid,
      targetUid: incomingUid,
      action: (user, target) => {
        User.acceptIncomingRequest(user, target);
      },
    });
  }
}

// Singleton export
export const userService = new UserService();
