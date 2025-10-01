// const functions = require("firebase-functions");
require('dotenv').config()
require("./firebaseConfig");

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("Using Firestore emulator");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}

const { addUserEndpoint, updateUserEndpoint } = require("./routes/userRoute");

exports.addUser = addUserEndpoint;
exports.updateUser = updateUserEndpoint;