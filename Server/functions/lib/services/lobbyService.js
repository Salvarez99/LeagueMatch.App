"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyService = exports.LobbyService = void 0;
const firebaseConfig_1 = require("../firebaseConfig");
const userService_1 = require("./userService");
const Lobby_1 = require("../models/Lobby");
const Error = __importStar(require("../utils/AppError"));
class LobbyService {
    constructor() {
        this.lobbiesRef = firebaseConfig_1.db.collection("lobbies");
    }
    async create(lobbyData) {
        const { hostId, gameMap, gameMode = null, hostPosition = null, championId = null, rankFilter = [], } = lobbyData;
        if (!hostId || !gameMap) {
            throw new Error.BadRequestError("hostId and gameMap are required");
        }
        // Ensure host exists
        const host = await userService_1.userService.getUserById(hostId);
        if (!host)
            throw new Error.NotFoundError("Host user not found");
        if (!host.riotId) {
            const err = new Error.UnauthorizedError("Host must link Riot ID before creating a lobby");
            err.code = "MISSING_RIOT_ID";
            throw err;
        }
        // Check existing active lobby
        const snapshot = await this.lobbiesRef.where("hostId", "==", hostId).get();
        snapshot.forEach((doc) => {
            if (doc.data().isActive)
                throw new Error.BadRequestError(`hostId ${hostId} active lobby already exists`);
        });
        // Create lobby instance
        const lobby = new Lobby_1.Lobby(hostId, host.riotId, gameMap, gameMode, hostPosition, championId, rankFilter);
        // Save lobby
        const docRef = await this.lobbiesRef.add(lobby.toFirestore());
        return { id: docRef.id, ...lobby.toFirestore() };
    }
    async updateReadyStatus(lobbyId, uid) {
        if (!lobbyId)
            throw new Error.NotFoundError("Invalid lobbyId");
        if (!uid)
            throw new Error.BadRequestError("uid required");
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            const players = (snap.data()?.players ?? []);
            const updatedPlayers = players.map((p) => p.uid === uid ? { ...p, ready: !p.ready } : p);
            // Partial update — keep update()
            tx.update(lobbyRef, { players: updatedPlayers });
        });
    }
    async kickPlayer(lobbyId, hostId, targetUid) {
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            const lobby = Lobby_1.Lobby.fromFirestore(snap.data());
            if (lobby.hostId !== hostId)
                throw new Error.UnauthorizedError("Only host can kick players");
            lobby.removePlayer(targetUid, true);
            // Full object write — use set()
            tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
        });
    }
    async updateDiscord(lobbyId, hostId, discordLink) {
        const ref = this.lobbiesRef.doc(lobbyId);
        return firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(ref);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            if (snap.data().hostId !== hostId)
                throw new Error.UnauthorizedError("Not authorized");
            // Partial update — update()
            tx.update(ref, { discordLink: discordLink || null });
        });
    }
    async updateChampion(lobbyId, uid, championId) {
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            const players = (snap.data()?.players ?? []);
            const updatedPlayers = players.map((p) => p.uid === uid ? { ...p, championId } : p);
            // Partial update — allowed
            tx.update(lobbyRef, { players: updatedPlayers });
        });
    }
    async getAvailableLobbies(desiredRole) {
        const snapshot = await this.lobbiesRef
            .where("isActive", "==", true)
            .get();
        if (snapshot.empty)
            return [];
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    async getLobbyById(lobbyId) {
        const doc = await this.lobbiesRef.doc(lobbyId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    filterKicked(uid, docs) {
        return docs.filter((d) => !d.data().kickedPlayers?.includes(uid));
    }
    async findLobby(data) {
        const { gameMap, gameMode, desiredPosition, ranks, uid } = data;
        if (!uid)
            throw new Error.BadRequestError("uid required");
        switch (gameMap) {
            case "Summoner's Rift":
                if (!desiredPosition)
                    throw new Error.BadRequestError("desiredPosition required");
                return this.searchForRift(gameMap, gameMode, desiredPosition, ranks ?? [], uid);
            case "Aram":
                return this.searchForAram(gameMap, gameMode, uid);
            case "Featured Mode":
                return this.searchForFeatured(gameMap, gameMode, uid);
            default:
                throw new Error.BadRequestError("Unsupported GameMap");
        }
    }
    async joinLobby(lobbyId, playerData) {
        const { uid, position = null, championId = null } = playerData;
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        const user = await userService_1.userService.getUserById(uid);
        if (!user)
            throw new Error.NotFoundError("User not found");
        if (!user.riotId) {
            const err = new Error.UnauthorizedError("User must link Riot ID");
            err.code = "MISSING_RIOT_ID";
            throw err;
        }
        let resultLobby = null;
        await firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            const lobby = Lobby_1.Lobby.fromFirestore(snap.data());
            if (!lobby.isActive)
                throw new Error.BadRequestError("Lobby inactive");
            lobby.addPlayer(uid, user.riotId, position, championId);
            // Full object write — use set()
            tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
            resultLobby = { id: lobbyId, ...lobby.toFirestore() };
        });
        return resultLobby;
    }
    async leaveById(lobbyId, uid) {
        const lobbyRef = this.lobbiesRef.doc(lobbyId);
        await firebaseConfig_1.db.runTransaction(async (tx) => {
            const snap = await tx.get(lobbyRef);
            if (!snap.exists)
                throw new Error.NotFoundError("Lobby not found");
            const lobby = Lobby_1.Lobby.fromFirestore(snap.data());
            lobby.removePlayer(uid);
            // Full write — set()
            tx.set(lobbyRef, lobby.toFirestore(), { merge: true });
        });
    }
    findBase(gameMap, gameMode) {
        return this.lobbiesRef
            .where("gameMap", "==", gameMap)
            .where("gameMode", "==", gameMode)
            .where("isActive", "==", true);
    }
    async searchForRift(gameMap, gameMode, desiredPosition, ranks, uid) {
        const base = this.findBase(gameMap, gameMode);
        const positionSnap = await base
            .where("filter.positionsNeeded", "array-contains", desiredPosition)
            .get();
        const rankSnap = ranks.length > 0
            ? await base
                .where("filter.ranksFilter", "array-contains-any", ranks)
                .get()
            : null;
        const merged = rankSnap
            ? rankSnap.docs.filter((d) => new Set(positionSnap.docs.map((p) => p.id)).has(d.id))
            : positionSnap.docs;
        const cleaned = this.filterKicked(uid, merged);
        if (cleaned.length === 0)
            return null;
        const doc = cleaned[0];
        return { id: doc.id, ...doc.data() };
    }
    async searchForAram(gameMap, gameMode, uid) {
        const snap = await this.findBase(gameMap, gameMode).get();
        if (snap.empty)
            return null;
        const cleaned = this.filterKicked(uid, snap.docs);
        return cleaned.length ? { id: cleaned[0].id, ...cleaned[0].data() } : null;
    }
    async searchForFeatured(gameMap, gameMode, uid) {
        const snap = await this.findBase(gameMap, gameMode).get();
        if (snap.empty)
            return null;
        const cleaned = this.filterKicked(uid, snap.docs);
        return cleaned.length ? { id: cleaned[0].id, ...cleaned[0].data() } : null;
    }
}
exports.LobbyService = LobbyService;
exports.lobbyService = new LobbyService();
