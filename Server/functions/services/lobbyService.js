const db = require("../firebaseConfig").db;
const userService = require("./userService");
const Lobby = require("../models/Lobby");

class LobbyService {
  constructor() {
    this.lobbiesRef = db.collection("lobbies");
  }

  async create(lobbyData) {
    const {
      hostId,
      gameMap,
      gameMode = null,
      hostPosition = null,
      championId = null,
      rankFilter = [],
    } = lobbyData;

    // Validation
    if (!hostId || !gameMap) {
      throw new Error("hostId and gameMap are required");
    }

    // Ensure host exists
    const host = await userService.getUserById(hostId);
    if (!host) {
      throw new Error("Host user not found");
    }

    // const lobbiesRef = db.collection("lobbies");
    const snapshot = await this.lobbiesRef.where("hostId", "==", hostId).get();

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        if (doc.data().isActive)
          throw new Error(`hostId ${hostId} active lobby already exists`);
      });
    }

    // Create lobby instance from model
    const lobby = new Lobby(
      hostId,
      gameMap,
      gameMode,
      hostPosition,
      championId,
      rankFilter
    );

    // Save to Firestore
    const docRef = await this.lobbiesRef.add(lobby.toFirestore());

    return {
      id: docRef.id,
      ...lobby.toFirestore(),
    };
  }

  async getAvailableLobbies(desiredRole) {
    const snapshot = await this.lobbiesRef
      .where("isActive", "==", true)
      .where("filters.rolesNeeded", "array-contains", desiredRole)
      .get();

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

  async findLobby(data) {
    const { gameMap, gameMode, desiredPostion, ranks } = data;

    switch (gameMap){
      case "Summoner\'s Rift":
        break;
      case "Aram":
        break;
      case "Featured Mode":
        break;
      default:
        throw new Error("Unsupported GameMap");
    }
  }

  async joinLobby(lobbyId, playerData) {
    const { uid, position = null, championId = null } = playerData;
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    let resultLobby = null;

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      // Rebuild lobby instance from Firestore
      const lobby = Lobby.fromFireStore(lobbySnap.data());

      // Check state before join
      if (!lobby.isActive) throw new Error("Lobby is inactive");

      // Add the player using model logic
      lobby.addPlayer(uid, position, championId);

      // Write back to Firestore
      transaction.update(lobbyRef, lobby.toFirestore());

      resultLobby = { id: lobbyId, ...lobby.toFirestore() };
    });

    return resultLobby;
  }

  async leaveById(lobbyId, uid) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      const lobby = Lobby.fromFireStore(lobbySnap.data());

      lobby.removePlayer(uid);

      // Write back to Firestore
      transaction.update(lobbyRef, lobby.toFirestore());
    });
  }
}

module.exports = new LobbyService();
