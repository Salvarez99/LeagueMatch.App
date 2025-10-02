const db = require("../firebaseConfig").db;
const {getUserById} = require("./userService");


async function createLobby(lobbyData) {
  const { hostId, game, maxPlayers, filters } = lobbyData;

  if (!hostId || !game || !maxPlayers) {
    throw new Error("hostId, game, and maxPlayers are required");
  }

  // Check if host exists
  const hostSnap = await getUserById(hostId);
  if (!hostSnap.exists) {
    throw new Error("Host user not found");
  }

  const lobby = {
    hostId,
    game,
    maxPlayers,
    players: [hostId],
    filters: filters || {},
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  const docRef = await db.collection("lobbies").add(lobby);

  return { lobbyId: docRef.id, ...lobby };
}

module.exports = { createLobby };