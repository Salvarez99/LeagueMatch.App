"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const User_1 = require("../models/User");
const riotService_1 = require("./riotService");
const firebaseConfig_1 = require("../firebaseConfig");
class UserService {
    constructor() {
        this.usersRef = firebaseConfig_1.db.collection("users");
    }
    // Add a new user
    async addUser(userData) {
        const user = new User_1.User(userData);
        if (!user.uid || !user.username || !user.email) {
            throw new Error("uid, username, and email are required");
        }
        const userDoc = user.toJSON();
        await this.usersRef.doc(user.uid).set(userDoc);
        return { id: user.uid, ...userDoc };
    }
    // Get a user by UID
    async getUserById(uid) {
        const doc = await this.usersRef.doc(uid).get();
        if (!doc.exists)
            return null;
        return { id: doc.id, ...doc.data() };
    }
    // Update user with Riot info
    async updateUser(uid, username, riotId) {
        if (!riotId)
            throw new Error("riotId is required");
        if (!uid && !username)
            throw new Error("Either uid or username is required");
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
                throw new Error("User not found");
            userRef = snapshot.docs[0].ref;
        }
        // Riot API calls
        const [gameName, tag] = riotId.split("#");
        const account = await riotService_1.riotService.getAccountByRiotId(gameName, tag);
        const puuid = account.puuid;
        const rankData = await riotService_1.riotService.getRankByPuuid(puuid);
        // Riot API returns an array of entries, sometimes empty for unranked
        const soloQueue = rankData.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
        const rank = soloQueue ? `${soloQueue.tier} ${soloQueue.rank}` : "Unranked";
        await userRef.set({ riotId, puuid, rank }, { merge: true });
        return { uid: userRef.id, riotId, puuid, rank };
    }
}
exports.UserService = UserService;
// Singleton export
exports.userService = new UserService();
