const db = require("../firebaseConfig").db;
const userService = require("./userService");
const Lobby = require("../models/Lobby");
class LobbyService {
    constructor() {
        this.lobbiesRef = db.collection("lobbies");
    }
    async create(lobbyData) {
        const { hostId, gameMap, gameMode = null, hostPosition = null, championId = null, rankFilter = [], } = lobbyData;
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
        const lobby = new Lobby(hostId, host.riotId, gameMap, gameMode, hostPosition, championId, rankFilter);
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
        if (!uid)
            throw new Error("uid required");
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        console.log("LOBBY ID:", lobbyId);
        console.log("REF PATH:", lobbyRef.path);
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error("Lobby not found");
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
    async kickPlayer(lobbyId, hostId, targetUid) {
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error("Lobby not found");
            const lobby = Lobby.fromFireStore(snap.data());
            // Ensure the caller is the host
            if (lobby.hostId !== hostId) {
                throw new Error("Unauthorized: Only the host can kick players");
            }
            // Remove the player and restore the needed role
            lobby.removePlayer(targetUid, true);
            // Write back updated state
            tx.update(lobbyRef, lobby.toFirestore());
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
    async updateChampion(lobbyId, uid, championId) {
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error("Lobby not found");
            const players = snap.data().players || [];
            const updatedPlayers = players.map((player) => player.uid === uid ? { ...player, championId } : player);
            tx.update(lobbyRef, { players: updatedPlayers });
        });
    }
    async getAvailableLobbies(desiredRole) {
        const snapshot = await this.lobbiesRef
            .where("isActive", "==", true)
            // .where("filters.rolesNeeded", "array-contains", desiredRole)
            .get();
        if (snapshot.empty)
            return [];
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async getLobbyById(lobbyId) {
        const doc = await this.lobbiesRef.doc(lobbyId).get();
        if (!doc.exists)
            return null;
        return { id: doc.id, ...doc.data() };
    }
    // 🔥 Shared kicked filtering helper
    filterKicked(uid, docs) {
        return docs.filter((d) => {
            const data = d.data();
            return !data.kickedPlayers?.includes(uid);
        });
    }
    async findLobby(data) {
        const { gameMap, gameMode, desiredPosition, ranks, uid } = data;
        if (!uid) {
            throw new Error("uid is required to find a lobby");
        }
        switch (gameMap) {
            case "Summoner's Rift":
                if (!desiredPosition)
                    throw new Error("desiredPosition is required for Summoner's Rift Modes");
                return this.searchForRift(gameMap, gameMode, desiredPosition, ranks, uid);
            case "Aram":
                return this.searchForAram(gameMap, gameMode, uid);
            case "Featured Mode":
                return this.searchForFeatured(gameMap, gameMode, uid);
            default:
                throw new Error("Unsupported GameMap");
        }
    }
    async joinLobby(lobbyId, playerData) {
        const { uid, position = null, championId = null } = playerData;
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        const user = await userService.getUserById(uid);
        if (!user)
            throw new Error("User not found");
        if (!user.riotId) {
            const err = new Error("User must link Riot ID before joining a lobby");
            err.code = "MISSING_RIOT_ID";
            throw err;
        }
        let resultLobby = null;
        await db.runTransaction(async (transaction) => {
            const lobbySnap = await transaction.get(lobbyRef);
            if (!lobbySnap.exists)
                throw new Error("Lobby not found");
            // Rebuild lobby instance from Firestore
            const lobby = Lobby.fromFireStore(lobbySnap.data());
            // Check state before join
            if (!lobby.isActive)
                throw new Error("Lobby is inactive");
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
            if (!lobbySnap.exists)
                throw new Error("Lobby not found");
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
    async searchForRift(gameMap, gameMode, desiredPosition, ranks, uid) {
        const baseQuery = await this.findBase(gameMap, gameMode);
        const positionSnap = await baseQuery
            .where("filter.positionsNeeded", "array-contains", desiredPosition)
            .get();
        const rankSnap = ranks?.length
            ? await baseQuery
                .where("filter.ranksFilter", "array-contains-any", ranks)
                .get()
            : null;
        // Merge the results safely
        let mergedDocs;
        if (rankSnap) {
            const positionIds = new Set(positionSnap.docs.map((d) => d.id));
            mergedDocs = rankSnap.docs.filter((d) => positionIds.has(d.id));
        }
        else {
            mergedDocs = positionSnap.docs;
        }
        // 🔥 Apply kicked filtering
        const cleaned = this.filterKicked(uid, mergedDocs);
        if (cleaned.length === 0)
            return null;
        const doc = cleaned[0];
        return { id: doc.id, ...doc.data() };
    }
    async searchForAram(gameMap, gameMode, uid) {
        const query = await this.findBase(gameMap, gameMode);
        const snap = await query.get();
        if (snap.empty)
            return null;
        const cleaned = this.filterKicked(uid, snap.docs);
        if (cleaned.length === 0)
            return null;
        return { id: cleaned[0].id, ...cleaned[0].data() };
    }
    async searchForFeatured(gameMap, gameMode, uid) {
        const query = await this.findBase(gameMap, gameMode);
        const snap = await query.get();
        if (snap.empty)
            return null;
        const cleaned = this.filterKicked(uid, snap.docs);
        if (cleaned.length === 0)
            return null;
        return { id: cleaned[0].id, ...cleaned[0].data() };
    }
}
module.exports = new LobbyService();
