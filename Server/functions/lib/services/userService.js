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
exports.userService = exports.UserService = void 0;
var User_1 = require("../models/User");
var riotService_1 = require("./riotService");
var Error = __importStar(require("../utils/AppError"));
var firebaseConfig_1 = require("../firebaseConfig");
var UserService = /** @class */ (function () {
    function UserService() {
        this.usersRef = firebaseConfig_1.db.collection("users");
    }
    // Add a new user
    UserService.prototype.addUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new User_1.User(userData);
                        if (!user.uid || !user.username || !user.email) {
                            throw new Error.BadRequestError("uid, username, and email are required");
                        }
                        userDoc = user.toJSON();
                        return [4 /*yield*/, this.usersRef.doc(user.uid).set(userDoc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, __assign({ id: user.uid }, userDoc)];
                }
            });
        });
    };
    // Get a user by UID
    UserService.prototype.getUserById = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRef.doc(uid).get()];
                    case 1:
                        doc = _a.sent();
                        if (!doc.exists)
                            return [2 /*return*/, null];
                        return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                }
            });
        });
    };
    // Update user with Riot info
    UserService.prototype.updateUser = function (uid, username, riotId) {
        return __awaiter(this, void 0, void 0, function () {
            var userRef, snapshot, _a, gameName, tag, account, puuid, rankData, soloQueue, rank;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!riotId)
                            throw new Error.UnauthorizedError("riotId is required");
                        if (!uid && !username)
                            throw new Error.UnauthorizedError("Either uid or username is required");
                        if (!uid) return [3 /*break*/, 1];
                        userRef = this.usersRef.doc(uid);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.usersRef
                            .where("username", "==", username)
                            .limit(1)
                            .get()];
                    case 2:
                        snapshot = _b.sent();
                        if (snapshot.empty)
                            throw new Error.NotFoundError("User not found");
                        userRef = snapshot.docs[0].ref;
                        _b.label = 3;
                    case 3:
                        _a = riotId.split("#"), gameName = _a[0], tag = _a[1];
                        return [4 /*yield*/, riotService_1.riotService.getAccountByRiotId(gameName, tag)];
                    case 4:
                        account = _b.sent();
                        puuid = account.puuid;
                        return [4 /*yield*/, riotService_1.riotService.getRankByPuuid(puuid)];
                    case 5:
                        rankData = _b.sent();
                        soloQueue = rankData.find(function (entry) { return entry.queueType === "RANKED_SOLO_5x5"; });
                        rank = soloQueue ? "".concat(soloQueue.tier, " ").concat(soloQueue.rank) : "Unranked";
                        return [4 /*yield*/, userRef.set({ riotId: riotId, puuid: puuid, rank: rank }, { merge: true })];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, { uid: userRef.id, riotId: riotId, puuid: puuid, rank: rank }];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
// Singleton export
exports.userService = new UserService();
