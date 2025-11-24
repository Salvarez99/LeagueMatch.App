"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportController = exportController;
const functions = __importStar(require("firebase-functions"));
/**
 * Auto-exports only the controller's own methods as Firebase HTTPS functions.
 * Filters out inherited Object methods and non-functions.
 */
function exportController(controller, prefix = "") {
    const exported = {};
    const prototype = Object.getPrototypeOf(controller);
    const methodNames = Object.getOwnPropertyNames(prototype).filter((key) => {
        const value = controller[key];
        // Skip constructor
        if (key === "constructor")
            return false;
        // Must be a function
        if (typeof value !== "function")
            return false;
        // Skip inherited object methods
        if ([
            "__defineGetter__",
            "__defineSetter__",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf",
            "__lookupGetter__",
            "__lookupSetter__",
            "__proto__",
        ].includes(key)) {
            return false;
        }
        return true;
    });
    for (const key of methodNames) {
        const functionName = prefix ? `${prefix}_${key}` : key;
        console.log(`function name: ${functionName}`);
        exported[functionName] = functions.https.onRequest((req, res) => controller[key](req, res));
    }
    return exported;
}
