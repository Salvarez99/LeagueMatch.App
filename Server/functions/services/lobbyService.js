const db = require("../firebaseConfig").db;
const userService = require("./userService");
const Lobby = require("../models/Lobby")

class LobbyService {
  constructor() {
    this.lobbiesRef = db.collection("lobbies");
  }

  async createLobby(lobbyData) {
    const { hostId, hostRole, gameMode, maxPlayers, filters } = lobbyData;

    if (!hostId || !hostRole || !gameMode || !maxPlayers) {
      throw new Error("hostId, hostRole, gameMode, and maxPlayers are required");
    }

    // Check if host exists
    const host = await userService.getUserById(hostId);
    if (!host) {
      throw new Error("Host user not found");
    }

    const lobby = new Lobby(
      hostId,
      hostRole,
      gameMode,
      maxPlayers,
      filters
    );

    const docRef = await this.lobbiesRef.add(lobby.toFirestore());
    return { id: docRef.id, ...lobby };
  }

  async joinLobby(lobbyId, playerData) {
    const { uid, role } = playerData;
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    let resultLobby = null; // will store the updated lobby to return later

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);

      if (!lobbySnap.exists) {
        throw new Error('Lobby not found');
      }

      const lobby = lobbySnap.data();

      if (!lobby.isActive) throw new Error('Lobby is inactive');
      if (lobby.players.some((p) => p.uid === uid))
        throw new Error('Player already in lobby');
      if (lobby.players.length >= lobby.maxPlayers)
        throw new Error('Lobby is full');

      const updatedPlayers = [...lobby.players, { uid, role }];
      const updatedLobby = {
        ...lobby,
        players: updatedPlayers,
        currentPlayers: updatedPlayers.length,
        isActive: updatedPlayers.length >= lobby.maxPlayers ? false : true,
      };

      transaction.update(lobbyRef, updatedLobby);

      // store for returning after transaction
      resultLobby = { id: lobbyId, ...updatedLobby };
    });

    return resultLobby;
  }


  async getAvailableLobbies() {
    const snapshot = await this.lobbiesRef.where("isActive", "==", true).get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getLobbyById(lobbyId) {
    const doc = await this.lobbiesRef.doc(lobbyId).get();

    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() };
  }
}

module.exports = new LobbyService();
