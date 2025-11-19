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

    if (!host.riotId) {
      const err = new Error("Host must link Riot ID before creating a lobby");
      err.code = "MISSING_RIOT_ID";
      throw err;
    }

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
      host.riotId,
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

  async updateReadyStatus(lobbyId, uid) {
    if (!lobbyId || typeof lobbyId !== "string") {
      throw new Error("Invalid lobbyId (was empty or undefined)");
    }
    if (!uid) throw new Error("uid required");

    const lobbyRef = this.lobbiesRef.doc(lobbyId);
    console.log("LOBBY ID:", lobbyId);
    console.log("REF PATH:", lobbyRef.path);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error("Lobby not found");

      const players = snap.data().players || [];

      const updatedPlayers = players.map((player) => {
        if (player.uid === uid) {
          return { ...player, ready: !player.ready };
        }
        return player;
      });

      tx.update(lobbyRef, { players: updatedPlayers });
    });
  }

  async kickPlayer(lobbyId, hostId, uid) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);
    const host = await userService.getUserById(hostId);
    if (!host) throw new Error("Host user not found");

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(lobbyRef);
      if (!snap.exists) throw new Error("Lobby not found");

      if (snap.data().hostId !== hostId) {
        throw new Error("Not authorized");
      }
      const players = snap.data().players || [];
      const playersAfterKick = players.filter((player) => player.uid !== uid);
      tx.update(lobbyRef, { players: playersAfterKick });
    });
  }

  async updateDiscord(lobbyId, hostId, discordLink) {
    const ref = this.lobbiesRef.doc(lobbyId);

    return db.runTransaction(async (tx) => {
      const lobbyDoc = await tx.get(ref);

      if (!lobbyDoc.exists) {
        throw new Error("Lobby not found");
      }

      if (lobbyDoc.data().hostId !== hostId) {
        throw new Error("Not authorized");
      }

      tx.update(ref, { discordLink: discordLink || null });
    });
  }

  async getAvailableLobbies(desiredRole) {
    const snapshot = await this.lobbiesRef
      .where("isActive", "==", true)
      // .where("filters.rolesNeeded", "array-contains", desiredRole)
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
        if (!desiredPosition)
          throw new Error(
            "desiredPosition is required for Summoner's Rift Modes"
          );
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

    const user = await userService.getUserById(uid);

    if (!user) throw new Error("User not found");

    if (!user.riotId) {
      const err = new Error("User must link Riot ID before joining a lobby");
      err.code = "MISSING_RIOT_ID";
      throw err;
    }

    let resultLobby = null;

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      // Rebuild lobby instance from Firestore
      const lobby = Lobby.fromFireStore(lobbySnap.data());

      // Check state before join
      if (!lobby.isActive) throw new Error("Lobby is inactive");

      // Add the player using model logic
      lobby.addPlayer(uid, user.riotId, position, championId);

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
    // First query: Find lobbies that need the desired position
    const positionQuery = await this.findBase(gameMap, gameMode);
    const positionSnap = await positionQuery
      .where("filter.positionsNeeded", "array-contains", desiredPosition)
      .get();

    // Second query: Find lobbies that match any of the specified ranks (if ranks provided)
    const rankQuery = await this.findBase(gameMap, gameMode);
    const rankSnap = ranks?.length
      ? await rankQuery
          .where("filter.ranksFilter", "array-contains-any", ranks)
          .get()
      : null;

    // Merge results: Rank filtering uses client-side intersection
    // - Create a Set of lobby IDs from position results for O(1) lookup
    const positionLobbies = new Set(positionSnap.docs.map((d) => d.id));

    // - If ranks were queried, filter rank results to only include lobbies
    //   that also matched the position requirement (intersection of both queries)
    // - If no ranks provided, use all position-matched lobbies
    const finalDocs = rankSnap
      ? rankSnap.docs.filter((d) => positionLobbies.has(d.id))
      : positionSnap.docs;

    if (finalDocs.length === 0) return null;

    // Return the first lobby that matches both position AND rank criteria
    const doc = finalDocs[0];
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
