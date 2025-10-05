require("dotenv").config();
require("./firebaseConfig");

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("🔥 Using Firestore emulator at localhost:4020");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}

const lobbyController = require("./controllers/lobbyController");
const userController = require("./controllers/userController");
const exportController = require("./utils/exportFunctions");

module.exports = {
  ...exportController(lobbyController, ""),
  ...exportController(userController, ""),
};