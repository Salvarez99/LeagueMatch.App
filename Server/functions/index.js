const functions = require("firebase-functions");
// const admin = require("firebase-admin");
require('dotenv').config()
require("./firebaseConfig");

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("Using Firestore emulator");
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:4020";
}

const { addUserEndpoint } = require("./routes/userRoute");

exports.addUser = addUserEndpoint;
