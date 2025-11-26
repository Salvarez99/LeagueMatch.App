"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lobbyController_1 = require("./controllers/lobbyController");
const userController_1 = require("./controllers/userController");
const exportFunctions_1 = require("./utils/exportFunctions");
Object.assign(exports, (0, exportFunctions_1.exportFunctions)(lobbyController_1.lobbyController, "lobby"));
Object.assign(exports, (0, exportFunctions_1.exportFunctions)(userController_1.userController, "user"));
