import * as functions from "firebase-functions";
import dotenv from "dotenv";
dotenv.config();

import { db } from "./firebaseConfig";

// import { lobbyController } from "./controllers/lobbyController";
import { userController } from "./controllers/userController";

import { exportController } from "./utils/exportFunctions";

// Configure Firestore emulator (optional)
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("🔥 Using Firestore emulator at localhost:4020");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}

// Export Firebase HTTPS Functions
// export const lobby = exportController(lobbyController, "lobby");
export const { user_addUser, user_updateUser } = exportController(
  userController,
  "user"
);
