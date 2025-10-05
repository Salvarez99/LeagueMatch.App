// utils/exportFunctions.js
const functions = require("firebase-functions");

function exportController(controller, prefix = "") {
  const exported = {};
  for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(controller))) {
    if (key === "constructor") continue;
    // wrap method as https function
    exported[`${prefix}${key}`] = functions.https.onRequest((req, res) =>
      controller[key](req, res)
    );
  }
  return exported;
}

module.exports = exportController;