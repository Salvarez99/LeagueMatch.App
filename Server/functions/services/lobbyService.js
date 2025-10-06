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
