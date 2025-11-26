"use strict";
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
exports.lobbyController = exports.LobbyController = void 0;
var lobbyService_1 = require("../services/lobbyService");
var LobbyController = /** @class */ (function () {
    function LobbyController() {
    }
    LobbyController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, hostId, gameMap, _b, gameMode, _c, hostPosition, _d, championId, _e, rankFilter, newLobby, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        _a = req.body, hostId = _a.hostId, gameMap = _a.gameMap, _b = _a.gameMode, gameMode = _b === void 0 ? null : _b, _c = _a.hostPosition, hostPosition = _c === void 0 ? null : _c, _d = _a.championId, championId = _d === void 0 ? null : _d, _e = _a.rankFilter, rankFilter = _e === void 0 ? [] : _e;
                        return [4 /*yield*/, lobbyService_1.lobbyService.create({
                                hostId: hostId,
                                gameMap: gameMap,
                                gameMode: gameMode,
                                hostPosition: hostPosition,
                                championId: championId,
                                rankFilter: rankFilter,
                            })];
                    case 1:
                        newLobby = _f.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: "Lobby created successfully",
                                id: newLobby.id,
                            })];
                    case 2:
                        err_1 = _f.sent();
                        if (err_1.statusCode) {
                            return [2 /*return*/, res.status(err_1.statusCode).json({
                                    success: false,
                                    message: err_1.message,
                                    code: err_1.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error creating lobby",
                                error: err_1.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.ready = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, uid, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lobbyId = req.query.lobbyId;
                        uid = req.query.uid;
                        return [4 /*yield*/, lobbyService_1.lobbyService.updateReadyStatus(lobbyId, uid)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Ready status updated successfully",
                            })];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2.statusCode) {
                            return [2 /*return*/, res.status(err_2.statusCode).json({
                                    success: false,
                                    message: err_2.message,
                                    code: err_2.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error updating ready status",
                                error: err_2.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.kick = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, hostId, uid, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lobbyId = req.query.lobbyId;
                        hostId = req.query.hostId;
                        uid = req.body.uid;
                        return [4 /*yield*/, lobbyService_1.lobbyService.kickPlayer(lobbyId, hostId, uid)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Player kicked successfully",
                            })];
                    case 2:
                        err_3 = _a.sent();
                        if (err_3.statusCode) {
                            return [2 /*return*/, res.status(err_3.statusCode).json({
                                    success: false,
                                    message: err_3.message,
                                    code: err_3.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error kicking player",
                                error: err_3.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.updateDiscord = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, lobbyId, hostId, discordLink, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, lobbyId = _a.lobbyId, hostId = _a.hostId, discordLink = _a.discordLink;
                        return [4 /*yield*/, lobbyService_1.lobbyService.updateDiscord(lobbyId, hostId, discordLink)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, res.json({ success: true })];
                    case 2:
                        err_4 = _b.sent();
                        if (err_4.statusCode) {
                            return [2 /*return*/, res.status(err_4.statusCode).json({
                                    success: false,
                                    message: err_4.message,
                                    code: err_4.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(400).json({ success: false, error: err_4.message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.updateChampion = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, uid, championId, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lobbyId = req.query.lobbyId;
                        uid = req.query.uid;
                        championId = req.body.championId;
                        return [4 /*yield*/, lobbyService_1.lobbyService.updateChampion(lobbyId, uid, championId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Champion updated successfully",
                            })];
                    case 2:
                        err_5 = _a.sent();
                        if (err_5.statusCode) {
                            return [2 /*return*/, res.status(err_5.statusCode).json({
                                    success: false,
                                    message: err_5.message,
                                    code: err_5.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error updating champion",
                                error: err_5.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.getAvailableLobbies = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var desiredRole, lobbies, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        desiredRole = req.body.desiredRole;
                        return [4 /*yield*/, lobbyService_1.lobbyService.getAvailableLobbies(desiredRole)];
                    case 1:
                        lobbies = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Available lobbies fetched",
                                lobbies: lobbies,
                            })];
                    case 2:
                        err_6 = _a.sent();
                        if (err_6.statusCode) {
                            return [2 /*return*/, res.status(err_6.statusCode).json({
                                    success: false,
                                    message: err_6.message,
                                    code: err_6.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error getting available lobbies",
                                error: err_6.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, lobby, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lobbyId = req.query.lobbyId;
                        if (!lobbyId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Missing required fields",
                                    error: "lobbyId query parameter is required",
                                })];
                        }
                        return [4 /*yield*/, lobbyService_1.lobbyService.getLobbyById(lobbyId)];
                    case 1:
                        lobby = _a.sent();
                        if (!lobby) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: "Error getting lobby",
                                    error: "Lobby id not found",
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Lobby found",
                                lobby: lobby,
                            })];
                    case 2:
                        err_7 = _a.sent();
                        if (err_7.statusCode) {
                            return [2 /*return*/, res.status(err_7.statusCode).json({
                                    success: false,
                                    message: err_7.message,
                                    code: err_7.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error retrieving lobby",
                                error: err_7.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.find = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, _a, gameMap, gameMode, _b, desiredPosition, _c, ranks, lobby, err_8;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        uid = req.query.uid;
                        _a = req.body, gameMap = _a.gameMap, gameMode = _a.gameMode, _b = _a.desiredPosition, desiredPosition = _b === void 0 ? null : _b, _c = _a.ranks, ranks = _c === void 0 ? [] : _c;
                        if (!gameMap || !gameMode) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "gameMap and gameMode are required",
                                })];
                        }
                        return [4 /*yield*/, lobbyService_1.lobbyService.findLobby({
                                gameMap: gameMap,
                                gameMode: gameMode,
                                desiredPosition: desiredPosition,
                                ranks: ranks,
                                uid: uid,
                            })];
                    case 1:
                        lobby = _d.sent();
                        if (!lobby) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: "No lobbies found",
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Lobby found",
                                id: lobby.id,
                            })];
                    case 2:
                        err_8 = _d.sent();
                        if (err_8.statusCode) {
                            return [2 /*return*/, res.status(err_8.statusCode).json({
                                    success: false,
                                    message: err_8.message,
                                    code: err_8.code || null,
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error finding lobby",
                                error: err_8.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.join = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, _a, uid, _b, position, _c, championId, updatedLobby, err_9;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        if (req.method !== "POST") {
                            return [2 /*return*/, res.status(405).json({
                                    success: false,
                                    message: "Method not allowed",
                                    error: "Use POST",
                                })];
                        }
                        lobbyId = req.query.lobbyId;
                        _a = req.body, uid = _a.uid, _b = _a.position, position = _b === void 0 ? null : _b, _c = _a.championId, championId = _c === void 0 ? null : _c;
                        if (!lobbyId || !uid) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Missing required fields",
                                    error: "Missing lobbyId and/or uid",
                                })];
                        }
                        return [4 /*yield*/, lobbyService_1.lobbyService.joinLobby(lobbyId, {
                                uid: uid,
                                position: position,
                                championId: championId,
                            })];
                    case 1:
                        updatedLobby = _d.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Player successfully joined lobby",
                                updatedLobby: updatedLobby,
                            })];
                    case 2:
                        err_9 = _d.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error joining lobby",
                                error: err_9.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LobbyController.prototype.leave = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lobbyId, uid, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (req.method !== "DELETE") {
                            return [2 /*return*/, res.status(405).json({
                                    success: false,
                                    message: "Method not allowed",
                                    error: "Use DELETE",
                                })];
                        }
                        lobbyId = req.query.lobbyId;
                        uid = req.query.uid;
                        if (!lobbyId || !uid) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Missing required fields",
                                    error: "lobbyId and/or uid",
                                })];
                        }
                        return [4 /*yield*/, lobbyService_1.lobbyService.leaveById(lobbyId, uid)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Left lobby successfully",
                            })];
                    case 2:
                        err_10 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Error leaving lobby.",
                                error: err_10.message,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return LobbyController;
}());
exports.LobbyController = LobbyController;
exports.lobbyController = new LobbyController();
