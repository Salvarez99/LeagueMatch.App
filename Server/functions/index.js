const functions = require("firebase-functions");
const admin = require("firebase-admin");
require('dotenv').config()

// admin.initializeApp();
// const authAdmin = admin.auth();
// const db = admin.firestore();
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("Using Firestore emulator");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}

const { addUserEndpoint } = require("./routes/userRoute");

exports.addUser = addUserEndpoint;

// exports.updateUser = functions.https.onRequest(async (req, res) => {
//   try {
//     const { uid, username, riotId } = req.body;

//     if (!riotId) {
//       return res.status(400).json({ error: "RiotId required" });
//     }

//     // Use UID if provided, else fallback to username for testing
//     if (!uid && !username) {
//       return res
//         .status(400)
//         .json({ error: "Either uid or username is required" });
//     }

//     // Find document reference
//     let userRef;
//     if (uid) {
//       userRef = db.collection("users").doc(uid);
//     } else {
//       // For testing: query by username
//       const snapshot = await db
//         .collection("users")
//         .where("username", "==", username)
//         .limit(1)
//         .get();
//       if (snapshot.empty) {
//         return res.status(404).json({ error: "User not found" });
//       }
//       userRef = snapshot.docs[0].ref;
//     }

//     // Riot API call
//     const [gameName, tag] = riotId.split("#");
//     const RIOT_API_KEY = process.env.RIOT_API_KEY; 
//     let baseUrl = "https://americas.api.riotgames.com"
//     const puuidUrl = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;
    
//     let response = await fetch(puuidUrl, {
//       headers: { "X-Riot-Token": RIOT_API_KEY },
//     });
    
//     if (!response.ok) {
//       return res
//       .status(response.status)
//       .json({ 
//         error: "Failed to fetch Riot account data"
//       });
//     }
    
//     let riotData = await response.json();
//     const puuid = riotData.puuid;
//     baseUrl = "https://na1.api.riotgames.com"
//     const rankUrl =  `${baseUrl}/lol/league/v4/entries/by-puuid/${puuid}`

//     response = await fetch(rankUrl, {
//       headers: { "X-Riot-Token": RIOT_API_KEY },
//     });
    
//     if (!response.ok) {
//       return res
//       .status(response.status)
//       .json({ 
//         error: "Failed to fetch Riot account data"
//       });
//     }
//     riotData = await response.json();
//     const rank = `${riotData[1].tier} ${riotData[1].rank}` 
//     await userRef.set(
//       { riotId, puuid, rank },
//       { merge: true } // merge with existing fields
//     );

//     res.status(200).json({
//       message: "User updated with PUUID",
//       user: { uid: userRef.id, riotId, puuid },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });



// // ===== List all users =====
// exports.listUsers = functions.https.onRequest(async (req, res) => {
//   try {
//     const snapshot = await db.collection("users").get();
//     const users = snapshot.docs.map(doc => doc.data());
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
