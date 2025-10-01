const db = require("../firebaseConfig").db;
const UserDTO = require("../models/UserDTO");
const { getAccountByRiotId, getRankByPuuid } = require("./riotService");

async function addUser(userData) {
  const user = new UserDTO(userData);
  await db.collection("users").add({ ...user });
  return user;
}

async function updateUser({ uid, username, riotId }) {
  if (!riotId) throw new Error("RiotId required");
  if (!uid && !username) throw new Error("Either uid or username is required");

  // Find document reference
  let userRef;
  if (uid) {
    userRef = db.collection("users").doc(uid);
  } else {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("User not found");
    }
    userRef = snapshot.docs[0].ref;
  }

  // Riot API calls
  const [gameName, tag] = riotId.split("#");
  const riotAccount = await getAccountByRiotId(gameName, tag);
  const puuid = riotAccount.puuid;

  const rankData = await getRankByPuuid(puuid);
  const rank = rankData[1] ? `${rankData[1].tier} ${rankData[1].rank}` : "Unranked";

  await userRef.set({ riotId, puuid, rank }, { merge: true });

  return { uid: userRef.id, riotId, puuid, rank };
}

module.exports = { addUser, updateUser };
