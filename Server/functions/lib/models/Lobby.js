"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
class Lobby {
    constructor(hostId, riotId, gameMap, gameMode = null, hostPosition = null, championId = null, ranksFilter = []) {
        if (!hostId || !gameMap)
            throw new Error("hostId and gameMap are required");
        this.hostId = hostId;
        this.gameMap = gameMap;
        this.gameMode = gameMode;
        this.kickedPlayers = [];
        this.currentPlayers = 1;
        this.createdAt = new Date().toISOString();
        this.isActive = true;
        // Determine map-specific configurations
        switch (gameMap) {
            case "Summoner's Rift": {
                if (!gameMode)
                    throw new Error("gameMode is required for Summoner's Rift");
                if (!hostPosition)
                    throw new Error("hostPosition is required for Summoner's Rift");
                if (!championId)
                    throw new Error("championId is required for Summoner's Rift");
                this.maxPlayers = gameMode === "Ranked Solo/Duo" ? 2 : 5;
                const positions = Lobby.mapPositions["Summoner's Rift"];
                const positionsNeeded = positions.filter((pos) => pos !== hostPosition);
                this.filter = {
                    ranksFilter: ranksFilter,
                    positionsNeeded: positionsNeeded,
                };
                break;
            }
            case "Aram": {
                if (!gameMode)
                    throw new Error("gameMode is required for Aram");
                this.maxPlayers = 5;
                this.filter = { ranksFilter: ranksFilter, positionsNeeded: [] };
                break;
            }
            case "Featured Modes": {
                if (!gameMode)
                    throw new Error("gameMode is required for Featured Mode");
                if (!championId)
                    throw new Error("championId is required for Featured Mode");
                this.maxPlayers = gameMode === "Arena" ? 2 : 5;
                this.filter = { ranksFilter: ranksFilter, positionsNeeded: [] };
                break;
            }
            default:
                throw new Error("Game Map is not supported");
        }
        // Player list starts with host
        this.players = [
            {
                uid: hostId,
                riotId: riotId,
                position: hostPosition || null,
                championId: championId || null,
                ready: false,
            },
        ];
    }
    addPlayer(uid, riotId, position = null, championId = null) {
        // Prevent duplicates
        if (this.players.some((p) => p.uid === uid)) {
            throw new Error("Player already in lobby");
        }
        if (this.currentPlayers >= this.maxPlayers) {
            throw new Error("Lobby is full");
        }
        // Behavior depends on the hosted map and mode
        switch (this.gameMap) {
            case "Summoner's Rift": {
                if (!position)
                    throw new Error("position is required for Summoner's Rift");
                if (!championId)
                    throw new Error("championId is required for Summoner's Rift");
                // Ensure the position is still available
                if (!this.filter.positionsNeeded.includes(position)) {
                    throw new Error(`Position ${position} is no longer available`);
                }
                // Add the player
                this.players.push({ uid, riotId, position, championId, ready: false });
                this.currentPlayers++;
                // Remove position from needed list
                this.filter.positionsNeeded = this.filter.positionsNeeded.filter((pos) => pos !== position);
                break;
            }
            case "Aram": {
                // ARAM: No roles or champion selection needed
                this.players.push({ uid, riotId, ready: false });
                this.currentPlayers++;
                break;
            }
            case "Featured Modes": {
                // Featured Mode (like Arena): Only champion required
                if (!championId)
                    throw new Error("championId is required for Featured Mode");
                this.players.push({ uid, riotId, championId, ready: false });
                this.currentPlayers++;
                break;
            }
            default:
                throw new Error("Unsupported game map");
        }
        // Update lobby status
        if (this.currentPlayers >= this.maxPlayers) {
            this.isActive = false;
        }
        else {
            this.isActive = true;
        }
    }
    removePlayer(uid, kicked = false) {
        // 0️⃣ If host leaves → shutdown lobby completely
        if (this.hostId === uid) {
            this.isActive = false;
            this.players = [];
            this.currentPlayers = 0;
            this.filter = {
                ranksFilter: this.filter?.ranksFilter ?? [],
                positionsNeeded: [],
            };
            this.kickedPlayers = this.kickedPlayers || [];
            this.kickedPlayers.push(uid);
            return;
        }
        // 1️⃣ Find player in the list
        const index = this.players.findIndex((p) => p.uid === uid);
        if (index === -1) {
            throw new Error("Player not found in lobby");
        }
        // Pull out the player being removed
        const [removedPlayer] = this.players.splice(index, 1);
        this.currentPlayers = Math.max(0, this.currentPlayers - 1);
        // Ensure structures exist
        this.filter = this.filter || { ranksFilter: [] };
        this.filter.positionsNeeded = this.filter.positionsNeeded || [];
        this.kickedPlayers = this.kickedPlayers || [];
        // 2️⃣ Restore role (Summoner's Rift only)
        if (this.gameMap === "Summoner's Rift") {
            // Normalize position
            const role = (removedPlayer.position || "").trim();
            if (role.length > 0) {
                // Only restore if not already included
                if (!this.filter.positionsNeeded.includes(role)) {
                    this.filter.positionsNeeded.push(role);
                }
            }
        }
        // 3️⃣ Track kicked/removed players for analytics
        if (kicked)
            this.kickedPlayers.push(uid);
        // 4️⃣ Reactivate lobby if it was full before
        if (this.currentPlayers < this.maxPlayers) {
            this.isActive = true;
        }
    }
    toFirestore() {
        return { ...this };
    }
    static fromFireStore(data) {
        const lobby = Object.create(Lobby.prototype);
        Object.assign(lobby, data);
        return lobby;
    }
}
exports.Lobby = Lobby;
Lobby.mapPositions = {
    "Summoner's Rift": ["Top", "Jungle", "Middle", "Adc", "Support"],
};
