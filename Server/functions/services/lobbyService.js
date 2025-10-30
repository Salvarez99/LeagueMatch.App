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

    const lobbiesRef = db.collection("lobbies");
    const snapshot = await lobbiesRef.where("hostId", "==", hostId).get();

    if (!snapshot.empty) {
      console.log("LOOKING")
      snapshot.forEach((doc) => {
        if (doc.data().isActive)
          throw new Error(`hostId ${hostId} active lobby already exists`);
        else
          console.log("NOT FOUND")
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

  async joinLobby(lobbyId, playerData) {
    const { uid, role } = playerData;
    const lobbyRef = this.lobbiesRef.doc(lobbyId);

    let resultLobby = null; // will store the updated lobby to return later

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);

      if (!lobbySnap.exists) {
        throw new Error("Lobby not found");
      }

      const lobby = lobbySnap.data();

      if (!lobby.isActive) throw new Error("Lobby is inactive");
      if (lobby.players.some((p) => p.uid === uid))
        throw new Error("Player already in lobby");
      if (lobby.players.length >= lobby.maxPlayers)
        throw new Error("Lobby is full");

      const updatedPlayers = [...lobby.players, { uid, role }];
      const updatedRolesNeeded = lobby.filters?.rolesNeeded
        ? lobby.filters.rolesNeeded.filter((r) => r !== role)
        : [];
      const updatedLobby = {
        ...lobby,
        players: updatedPlayers,
        currentPlayers: updatedPlayers.length,
        filters: {
          ...lobby.filters,
          rolesNeeded: updatedRolesNeeded,
        },
        isActive: updatedPlayers.length >= lobby.maxPlayers ? false : true,
      };

      transaction.update(lobbyRef, updatedLobby);

      // store for returning after transaction
      resultLobby = { id: lobbyId, ...updatedLobby };
    });

    return resultLobby;
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

  async leaveLobby(lobbyId, uid) {
    const lobbyRef = this.lobbiesRef.doc(lobbyId);
    let resultLobby = null;

    await db.runTransaction(async (transaction) => {
      const lobbySnap = await transaction.get(lobbyRef);
      if (!lobbySnap.exists) throw new Error("Lobby not found");

      const lobby = lobbySnap.data();

      // Find the leaving player
      const leavingPlayer = lobby.players.find((p) => p.uid === uid);
      if (!leavingPlayer) throw new Error("Player not in lobby");

      // Remove player from array
      const updatedPlayers = lobby.players.filter((p) => p.uid !== uid);

      // Add their role back to rolesNeeded (if not already there)
      const updatedRolesNeeded = Array.isArray(lobby.filters?.rolesNeeded)
        ? [...new Set([...lobby.filters.rolesNeeded, leavingPlayer.role])]
        : [leavingPlayer.role];

      const updatedLobby = {
        ...lobby,
        players: updatedPlayers,
        currentPlayers: updatedPlayers.length,
        isActive: true, // always reopen the lobby if someone leaves
        filters: {
          ...lobby.filters,
          rolesNeeded: updatedRolesNeeded,
        },
      };

      // Write back to Firestore
      transaction.update(lobbyRef, updatedLobby);

      resultLobby = { id: lobbyId, ...updatedLobby };
    });
    return resultLobby;
  }
}

module.exports = new LobbyService();
