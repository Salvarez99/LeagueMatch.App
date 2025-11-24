"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_updateUser = exports.user_addUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import { lobbyController } from "./controllers/lobbyController";
const userController_1 = require("./controllers/userController");
const exportFunctions_1 = require("./utils/exportFunctions");
// Configure Firestore emulator (optional)
if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log("🔥 Using Firestore emulator at localhost:4020");
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}
// Export Firebase HTTPS Functions
// export const lobby = exportController(lobbyController, "lobby");
_a = (0, exportFunctions_1.exportController)(userController_1.userController, "user"), exports.user_addUser = _a.user_addUser, exports.user_updateUser = _a.user_updateUser;
