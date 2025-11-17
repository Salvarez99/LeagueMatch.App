const db = require("../firebaseConfig").db;
const User = require("../models/User");
const riotService = require("./riotService");

class UserService {
  constructor() {
    this.usersRef = db.collection("users");
  }

  // Add a new user
  async addUser(userData) {
    // const user = new User(userData);
    const user = new User(userData);
    
    if (!user.uid || !user.username || !user.email) {
      throw new Error("uid, username, and email are required");
    }
    const userDoc = user.toJSON();

    await this.usersRef.doc(user.uid).set(userDoc);

    return { id: user.uid, ...userDoc };

  }

  // Get user by UID
  async getUserById(uid) {
    const doc = await this.usersRef.doc(uid).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update user with Riot info
  async updateUser({ uid, username, riotId }) {
    if (!riotId) throw new Error("riotId is required");
    if (!uid && !username)
      throw new Error("Either uid or username is required");

    let userRef;

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
    const riotAccount = await riotService.getAccountByRiotId(gameName, tag);
    const puuid = riotAccount.puuid;

    const rankData = await riotService.getRankByPuuid(puuid);
    const rank = rankData[1]
      ? `${rankData[1].tier} ${rankData[1].rank}`
      : "Unranked";

    await userRef.set({ riotId, puuid, rank }, { merge: true });

    return { uid: userRef.id, riotId, puuid, rank };
  }
}

module.exports = new UserService();
