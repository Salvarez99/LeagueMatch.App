import { User } from "../models/User";
import { riotService } from "./riotService";
import * as Error from "../utils/AppError";
import { db } from "../firebaseConfig";
export class UserService {
    constructor() {
        this.usersRef = db.collection("users");
    }
    // Add a new user
    async addUser(userData) {
        const user = new User(userData);
        if (!user.uid || !user.username || !user.email) {
            throw new Error.BadRequestError("uid, username, and email are required");
        }
        const userDoc = user.toJSON();
        await this.usersRef.doc(user.uid).set(userDoc);
        return Object.assign({ id: user.uid }, userDoc);
    }
    // Get a user by UID
    async getUserById(uid) {
        const doc = await this.usersRef.doc(uid).get();
        if (!doc.exists)
            return null;
        return Object.assign({ id: doc.id }, doc.data());
    }
    // Update user with Riot info
    async updateUser(uid, username, riotId) {
        if (!riotId)
            throw new Error.UnauthorizedError("riotId is required");
        if (!uid && !username)
            throw new Error.UnauthorizedError("Either uid or username is required");
        let userRef;
        // Resolve Firestore reference
        if (uid) {
            userRef = this.usersRef.doc(uid);
        }
        else {
            const snapshot = await this.usersRef
                .where("username", "==", username)
                .limit(1)
                .get();
            if (snapshot.empty)
                throw new Error.NotFoundError("User not found");
            userRef = snapshot.docs[0].ref;
        }
        // Riot API calls
        const [gameName, tag] = riotId.split("#");
        const account = await riotService.getAccountByRiotId(gameName, tag);
        const puuid = account.puuid;
        const rankData = await riotService.getRankByPuuid(puuid);
        // Riot API returns an array of entries, sometimes empty for unranked
        const soloQueue = rankData.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
        const rank = soloQueue ? `${soloQueue.tier} ${soloQueue.rank}` : "Unranked";
        await userRef.set({ riotId, puuid, rank }, { merge: true });
        return { uid: userRef.id, riotId, puuid, rank };
    }
}
// Singleton export
export const userService = new UserService();
