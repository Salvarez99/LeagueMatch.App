const functions = require("firebase-functions");
function exportController(controller, prefix = "") {
    const exported = {};
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(controller))) {
        if (key === "constructor")
            continue;
        // ✅ Use underscore between prefix and method name
        const functionName = prefix ? `${prefix}_${key}` : key;
        exported[functionName] = functions.https.onRequest((req, res) => controller[key](req, res));
    }
    return exported;
}
module.exports = exportController;
