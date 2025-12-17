import * as functions from "firebase-functions";
import { app } from "./app";

import { lobbyController } from "./controllers/lobbyController";
import { userController } from "./controllers/userController";
import { exportFunctions } from "./utils/exportFunctions";


export const api = functions.https.onRequest(app);

Object.assign(exports, exportFunctions(lobbyController, "lobby"));
Object.assign(exports, exportFunctions(userController, "user"));