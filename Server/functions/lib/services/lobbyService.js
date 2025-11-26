"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyService = exports.LobbyService = void 0;
var firebaseConfig_1 = require("../firebaseConfig");
var userService_1 = require("./userService");
var Lobby_1 = require("../models/Lobby");
var Error = __importStar(require("../utils/AppError"));
var LobbyService = /** @class */ (function () {
    function LobbyService() {
        this.lobbiesRef = firebaseConfig_1.db.collection("lobbies");
    }
    LobbyService.prototype.create = function (lobbyData) {
        return __awaiter(this, void 0, void 0, function () {
            var hostId, gameMap, _a, gameMode, _b, hostPosition, _c, championId, _d, rankFilter, host, err, snapshot, lobby, docRef;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        hostId = lobbyData.hostId, gameMap = lobbyData.gameMap, _a = lobbyData.gameMode, gameMode = _a === void 0 ? null : _a, _b = lobbyData.hostPosition, hostPosition = _b === void 0 ? null : _b, _c = lobbyData.championId, championId = _c === void 0 ? null : _c, _d = lobbyData.rankFilter, rankFilter = _d === void 0 ? [] : _d;
                        if (!hostId || !gameMap) {
                            throw new Error.BadRequestError("hostId and gameMap are required");
                        }
                        return [4 /*yield*/, userService_1.userService.getUserById(hostId)];
                    case 1:
                        host = _e.sent();
                        if (!host) {
                            throw new Error.NotFoundError("Host user not found");
                        }
                        if (!host.riotId) {
                            err = new Error.UnauthorizedError("Host must link Riot ID before creating a lobby");
                            err.code = "MISSING_RIOT_ID";
                            throw err;
                        }
                        return [4 /*yield*/, this.lobbiesRef.where("hostId", "==", hostId).get()];
                    case 2:
                        snapshot = _e.sent();
                        if (!snapshot.empty) {
                            snapshot.forEach(function (doc) {
                                if (doc.data().isActive) {
                                    throw new Error.BadRequestError("hostId ".concat(hostId, " active lobby already exists"));
                                }
                            });
                        }
                        lobby = new Lobby_1.Lobby(hostId, host.riotId, gameMap, gameMode, hostPosition, championId, rankFilter !== null && rankFilter !== void 0 ? rankFilter : []);
                        return [4 /*yield*/, this.lobbiesRef.add(lobby.toFirestore())];
                    case 3:
                        docRef = _e.sent();
                        return [2 /*return*/, __assign({ id: docRef.id }, lobby.toFirestore())];
                }
            });
        });
    };
    LobbyService.prototype.updateReadyStatus = function (lobbyId, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyRef;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!lobbyId || typeof lobbyId !== "string") {
                            throw new Error.NotFoundError("Invalid lobbyId (was empty or undefined)");
                        }
                        if (!uid)
                            throw new Error.BadRequestError("uid required");
                        lobbyRef = this.lobbiesRef.doc(lobbyId);
                        console.log("LOBBY ID:", lobbyId);
                        console.log("REF PATH:", lobbyRef.path);
                        return [4 /*yield*/, firebaseConfig_1.db.runTransaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var snap, players, updatedPlayers;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, tx.get(lobbyRef)];
                                        case 1:
                                            snap = _c.sent();
                                            if (!snap.exists)
                                                throw new Error.NotFoundError("Lobby not found");
                                            players = ((_b = (_a = snap.data()) === null || _a === void 0 ? void 0 : _a.players) !== null && _b !== void 0 ? _b : []);
                                            updatedPlayers = players.map(function (player) {
                                                if (player.uid === uid) {
                                                    return __assign(__assign({}, player), { ready: !player.ready });
                                                }
                                                return player;
                                            });
                                            tx.update(lobbyRef, { players: updatedPlayers });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyService.prototype.kickPlayer = function (lobbyId, hostId, targetUid) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyRef;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lobbyRef = this.lobbiesRef.doc(lobbyId);
                        return [4 /*yield*/, firebaseConfig_1.db.runTransaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var snap, lobby;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.get(lobbyRef)];
                                        case 1:
                                            snap = _a.sent();
                                            if (!snap.exists)
                                                throw new Error.NotFoundError("Lobby not found");
                                            lobby = Lobby_1.Lobby.fromFireStore(snap.data());
                                            if (lobby.hostId !== hostId) {
                                                throw new Error.UnauthorizedError("Unauthorized: Only the host can kick players");
                                            }
                                            lobby.removePlayer(targetUid, true);
                                            tx.update(lobbyRef, lobby.toFirestore());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyService.prototype.updateDiscord = function (lobbyId, hostId, discordLink) {
        return __awaiter(this, void 0, void 0, function () {
            var ref;
            var _this = this;
            return __generator(this, function (_a) {
                ref = this.lobbiesRef.doc(lobbyId);
                return [2 /*return*/, firebaseConfig_1.db.runTransaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var lobbyDoc;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, tx.get(ref)];
                                case 1:
                                    lobbyDoc = _b.sent();
                                    if (!lobbyDoc.exists) {
                                        throw new Error.NotFoundError("Lobby not found");
                                    }
                                    if (((_a = lobbyDoc.data()) === null || _a === void 0 ? void 0 : _a.hostId) !== hostId) {
                                        throw new Error.UnauthorizedError("Not authorized");
                                    }
                                    tx.update(ref, { discordLink: discordLink || null });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    LobbyService.prototype.updateChampion = function (lobbyId, uid, championId) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyRef;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lobbyRef = this.lobbiesRef.doc(lobbyId);
                        return [4 /*yield*/, firebaseConfig_1.db.runTransaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var snap, players, updatedPlayers;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, tx.get(lobbyRef)];
                                        case 1:
                                            snap = _c.sent();
                                            if (!snap.exists)
                                                throw new Error.NotFoundError("Lobby not found");
                                            players = ((_b = (_a = snap.data()) === null || _a === void 0 ? void 0 : _a.players) !== null && _b !== void 0 ? _b : []);
                                            updatedPlayers = players.map(function (player) {
                                                return player.uid === uid ? __assign(__assign({}, player), { championId: championId }) : player;
                                            });
                                            tx.update(lobbyRef, { players: updatedPlayers });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyService.prototype.getAvailableLobbies = function (desiredRole) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lobbiesRef
                            .where("isActive", "==", true)
                            // .where("filter.rolesNeeded", "array-contains", desiredRole)
                            .get()];
                    case 1:
                        snapshot = _a.sent();
                        if (snapshot.empty)
                            return [2 /*return*/, []];
                        return [2 /*return*/, snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
                }
            });
        });
    };
    LobbyService.prototype.getLobbyById = function (lobbyId) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lobbiesRef.doc(lobbyId).get()];
                    case 1:
                        doc = _a.sent();
                        if (!doc.exists)
                            return [2 /*return*/, null];
                        return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                }
            });
        });
    };
    // 🔥 Shared kicked filtering helper
    LobbyService.prototype.filterKicked = function (uid, docs) {
        return docs.filter(function (d) {
            var _a;
            var data = d.data();
            return !((_a = data.kickedPlayers) === null || _a === void 0 ? void 0 : _a.includes(uid));
        });
    };
    LobbyService.prototype.findLobby = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var gameMap, gameMode, desiredPosition, ranks, uid;
            return __generator(this, function (_a) {
                gameMap = data.gameMap, gameMode = data.gameMode, desiredPosition = data.desiredPosition, ranks = data.ranks, uid = data.uid;
                if (!uid) {
                    throw new Error.BadRequestError("uid is required to find a lobby");
                }
                switch (gameMap) {
                    case "Summoner's Rift":
                        if (!desiredPosition) {
                            throw new Error.BadRequestError("desiredPosition is required for Summoner's Rift Modes");
                        }
                        return [2 /*return*/, this.searchForRift(gameMap, gameMode, desiredPosition, ranks !== null && ranks !== void 0 ? ranks : [], uid)];
                    case "Aram":
                        return [2 /*return*/, this.searchForAram(gameMap, gameMode, uid)];
                    case "Featured Mode":
                        return [2 /*return*/, this.searchForFeatured(gameMap, gameMode, uid)];
                    default:
                        throw new Error.BadRequestError("Unsupported GameMap");
                }
                return [2 /*return*/];
            });
        });
    };
    LobbyService.prototype.joinLobby = function (lobbyId, playerData) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, _a, position, _b, championId, lobbyRef, user, err, resultLobby;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        uid = playerData.uid, _a = playerData.position, position = _a === void 0 ? null : _a, _b = playerData.championId, championId = _b === void 0 ? null : _b;
                        lobbyRef = this.lobbiesRef.doc(lobbyId);
                        return [4 /*yield*/, userService_1.userService.getUserById(uid)];
                    case 1:
                        user = _c.sent();
                        if (!user)
                            throw new Error.NotFoundError("User not found");
                        if (!user.riotId) {
                            err = new Error.UnauthorizedError("User must link Riot ID before joining a lobby");
                            err.code = "MISSING_RIOT_ID";
                            throw err;
                        }
                        resultLobby = null;
                        return [4 /*yield*/, firebaseConfig_1.db.runTransaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                                var lobbySnap, lobby;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, transaction.get(lobbyRef)];
                                        case 1:
                                            lobbySnap = _a.sent();
                                            if (!lobbySnap.exists)
                                                throw new Error.NotFoundError("Lobby not found");
                                            lobby = Lobby_1.Lobby.fromFireStore(lobbySnap.data());
                                            if (!lobby.isActive)
                                                throw new Error.BadRequestError("Lobby is inactive");
                                            lobby.addPlayer(uid, user.riotId, position, championId);
                                            transaction.update(lobbyRef, lobby.toFirestore());
                                            resultLobby = __assign({ id: lobbyId }, lobby.toFirestore());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, resultLobby];
                }
            });
        });
    };
    LobbyService.prototype.leaveById = function (lobbyId, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyRef;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lobbyRef = this.lobbiesRef.doc(lobbyId);
                        return [4 /*yield*/, firebaseConfig_1.db.runTransaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                                var lobbySnap, lobby;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, transaction.get(lobbyRef)];
                                        case 1:
                                            lobbySnap = _a.sent();
                                            if (!lobbySnap.exists)
                                                throw new Error.NotFoundError("Lobby not found");
                                            lobby = Lobby_1.Lobby.fromFireStore(lobbySnap.data());
                                            lobby.removePlayer(uid);
                                            transaction.update(lobbyRef, lobby.toFirestore());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Helpers
    LobbyService.prototype.findBase = function (gameMap, gameMode) {
        return this.lobbiesRef
            .where("gameMap", "==", gameMap)
            .where("gameMode", "==", gameMode)
            .where("isActive", "==", true);
    };
    LobbyService.prototype.searchForRift = function (gameMap, gameMode, desiredPosition, ranks, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var baseQuery, positionSnap, rankSnap, _a, mergedDocs, positionIds_1, cleaned, doc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        baseQuery = this.findBase(gameMap, gameMode);
                        return [4 /*yield*/, baseQuery
                                .where("filter.positionsNeeded", "array-contains", desiredPosition)
                                .get()];
                    case 1:
                        positionSnap = _b.sent();
                        if (!(ranks === null || ranks === void 0 ? void 0 : ranks.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, baseQuery
                                .where("filter.ranksFilter", "array-contains-any", ranks)
                                .get()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _b.label = 4;
                    case 4:
                        rankSnap = _a;
                        if (rankSnap) {
                            positionIds_1 = new Set(positionSnap.docs.map(function (d) { return d.id; }));
                            mergedDocs = rankSnap.docs.filter(function (d) { return positionIds_1.has(d.id); });
                        }
                        else {
                            mergedDocs = positionSnap.docs;
                        }
                        cleaned = this.filterKicked(uid, mergedDocs);
                        if (cleaned.length === 0)
                            return [2 /*return*/, null];
                        doc = cleaned[0];
                        return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                }
            });
        });
    };
    LobbyService.prototype.searchForAram = function (gameMap, gameMode, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var query, snap, cleaned;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.findBase(gameMap, gameMode);
                        return [4 /*yield*/, query.get()];
                    case 1:
                        snap = _a.sent();
                        if (snap.empty)
                            return [2 /*return*/, null];
                        cleaned = this.filterKicked(uid, snap.docs);
                        if (cleaned.length === 0)
                            return [2 /*return*/, null];
                        return [2 /*return*/, __assign({ id: cleaned[0].id }, cleaned[0].data())];
                }
            });
        });
    };
    LobbyService.prototype.searchForFeatured = function (gameMap, gameMode, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var query, snap, cleaned;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.findBase(gameMap, gameMode);
                        return [4 /*yield*/, query.get()];
                    case 1:
                        snap = _a.sent();
                        if (snap.empty)
                            return [2 /*return*/, null];
                        cleaned = this.filterKicked(uid, snap.docs);
                        if (cleaned.length === 0)
                            return [2 /*return*/, null];
                        return [2 /*return*/, __assign({ id: cleaned[0].id }, cleaned[0].data())];
                }
            });
        });
    };
    return LobbyService;
}());
exports.LobbyService = LobbyService;
exports.lobbyService = new LobbyService();
