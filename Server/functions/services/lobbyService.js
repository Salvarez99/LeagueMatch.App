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
    const { gameMap, gameMode, desiredPosition, ranks } = data;

    switch (gameMap) {
      case "Summoner's Rift":
        if(!desiredPosition)
          throw new Error("desiredPosition is required for Summoner's Rift Modes");
        return this.searchForRift(gameMap, gameMode, desiredPosition, ranks);

      case "Aram":
        return this.searchForAram(gameMap, gameMode);

      case "Featured Mode":
        return this.searchForFeatured(gameMap, gameMode);

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

  //Helpers
  async findBase(gameMap, gameMode) {
    return this.lobbiesRef
      .where("gameMap", "==", gameMap)
      .where("gameMode", "==", gameMode)
      .where("isActive", "==", true);
  }

  async searchForRift(gameMap, gameMode, desiredPosition, ranks) {
    let query = await this.findBase(gameMap, gameMode);

    // Filter by role needed
    query = query.where(
      "filter.positionsNeeded",
      "array-contains",
      desiredPosition
    );

    // Filter by rank list (if provided)
    if (ranks && ranks.length > 0) {
      query = query.where("filter.ranksFilter", "array-contains-any", ranks);
    }

    // Execute and limit to 1
    const querySnap = await query.limit(1).get();

    if (querySnap.empty) return null;

    const doc = querySnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async searchForAram(gameMap, gameMode) {
    const query = await this.findBase(gameMap, gameMode);

    const querySnap = await query.limit(1).get();

    if (querySnap.empty) return null;

    const doc = querySnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async searchForFeatured(gameMap, gameMode) {
    const query = await this.findBase(gameMap, gameMode); // get the Query
    const querySnap = await query.limit(1).get(); // then run it

    if (querySnap.empty) return null;
    const doc = querySnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = new LobbyService();
