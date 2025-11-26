export class Lobby {
    constructor(params) {
        const { hostId, riotId, gameMap, gameMode, hostPosition = null, championId = null, ranksFilter = [], } = params;
        if (!hostId || !gameMap)
            throw new Error("hostId and gameMap are required");
        this.hostId = hostId;
        this.gameMap = gameMap;
        this.gameMode = gameMode || "Unknown";
        this.createdAt = new Date().toISOString();
        this.currentPlayers = 1;
        this.isActive = true;
        this.kickedPlayers = [];
        // Configure game modes
        switch (gameMap) {
            case "Summoner's Rift": {
                if (!gameMode)
                    throw new Error("gameMode required for SR");
                if (!hostPosition)
                    throw new Error("hostPosition required for SR");
                if (!championId)
                    throw new Error("championId required for SR");
                this.maxPlayers =
                    gameMode === "Ranked Solo/Duo" ? 2 : Lobby.mapPositions[gameMap].length;
                const positions = Lobby.mapPositions["Summoner's Rift"];
                const positionsNeeded = positions.filter((p) => p !== hostPosition);
                this.filter = {
                    ranksFilter,
                    positionsNeeded,
                };
                break;
            }
            case "Aram":
                if (!gameMode)
                    throw new Error("gameMode required for Aram");
                this.maxPlayers = 5;
                this.filter = {
                    ranksFilter,
                    positionsNeeded: [],
                };
                break;
            case "Featured Modes":
                if (!gameMode)
                    throw new Error("gameMode required for Featured Modes");
                if (!championId)
                    throw new Error("championId required for Featured Modes");
                this.maxPlayers = gameMode === "Arena" ? 2 : 5;
                this.filter = {
                    ranksFilter,
                    positionsNeeded: [],
                };
                break;
            default:
                throw new Error(`Unsupported map: ${gameMap}`);
        }
        // Initialize players array (host is always first)
        this.players = [
            {
                uid: hostId,
                riotId,
                position: hostPosition,
                championId,
                ready: false,
            },
        ];
    }
    // ➤ Add a player to the lobby
    addPlayer(uid, riotId, position = null, championId = null) {
        if (this.players.some((p) => p.uid === uid)) {
            throw new Error("Player already in lobby");
        }
        if (this.currentPlayers >= this.maxPlayers) {
            throw new Error("Lobby is full");
        }
        switch (this.gameMap) {
            case "Summoner's Rift":
                if (!position)
                    throw new Error("position required for SR");
                if (!championId)
                    throw new Error("championId required for SR");
                if (!this.filter.positionsNeeded.includes(position)) {
                    throw new Error(`Position ${position} no longer available`);
                }
                this.players.push({ uid, riotId, position, championId, ready: false });
                this.filter.positionsNeeded = this.filter.positionsNeeded.filter((p) => p !== position);
                break;
            case "Aram":
                this.players.push({ uid, riotId, position: null, championId: null, ready: false });
                break;
            case "Featured Modes":
                if (!championId)
                    throw new Error("championId required for Featured Modes");
                this.players.push({ uid, riotId, position: null, championId, ready: false });
                break;
        }
        this.currentPlayers++;
        this.isActive = this.currentPlayers < this.maxPlayers;
    }
    // ➤ Remove a player
    removePlayer(uid, kicked = false) {
        if (uid === this.hostId) {
            // Closing lobby if host leaves
            this.isActive = false;
            this.players = [];
            this.currentPlayers = 0;
            this.kickedPlayers.push(uid);
            this.filter.positionsNeeded = [];
            return;
        }
        const index = this.players.findIndex((p) => p.uid === uid);
        if (index === -1)
            throw new Error("Player not found");
        const removed = this.players.splice(index, 1)[0];
        this.currentPlayers = Math.max(0, this.currentPlayers - 1);
        if (this.gameMap === "Summoner's Rift" && removed.position) {
            if (!this.filter.positionsNeeded.includes(removed.position)) {
                this.filter.positionsNeeded.push(removed.position);
            }
        }
        if (kicked)
            this.kickedPlayers.push(uid);
        this.isActive = this.currentPlayers < this.maxPlayers;
    }
    // ➤ Prepare object for Firestore
    toFirestore() {
        return {
            createdAt: this.createdAt,
            currentPlayers: this.currentPlayers,
            gameMap: this.gameMap,
            gameMode: this.gameMode,
            hostId: this.hostId,
            isActive: this.isActive,
            kickedPlayers: this.kickedPlayers,
            players: this.players,
        };
    }
    // ➤ Rehydrate class instance from Firestore
    static fromFirestore(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        const lobby = new Lobby({
            hostId: data.hostId,
            riotId: (_c = (_b = (_a = data.players) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.riotId) !== null && _c !== void 0 ? _c : "Unknown",
            gameMap: data.gameMap,
            gameMode: data.gameMode,
            hostPosition: (_f = (_e = (_d = data.players) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.position) !== null && _f !== void 0 ? _f : null,
            championId: (_j = (_h = (_g = data.players) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.championId) !== null && _j !== void 0 ? _j : null,
            ranksFilter: (_l = (_k = data.filter) === null || _k === void 0 ? void 0 : _k.ranksFilter) !== null && _l !== void 0 ? _l : [],
        });
        // overwrite properties
        lobby.players = (_m = data.players) !== null && _m !== void 0 ? _m : [];
        lobby.maxPlayers = (_o = data.maxPlayers) !== null && _o !== void 0 ? _o : lobby.maxPlayers;
        lobby.kickedPlayers = (_p = data.kickedPlayers) !== null && _p !== void 0 ? _p : [];
        lobby.isActive = (_q = data.isActive) !== null && _q !== void 0 ? _q : true;
        lobby.filter = (_r = data.filter) !== null && _r !== void 0 ? _r : lobby.filter;
        return lobby;
    }
}
Lobby.mapPositions = {
    "Summoner's Rift": ["Top", "Jungle", "Middle", "Adc", "Support"],
};
