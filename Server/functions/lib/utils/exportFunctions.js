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
exports.exportFunctions = exportFunctions;
var functions = __importStar(require("firebase-functions"));
/**
 * Creates Firebase HTTPS functions for each method of a controller instance.
 * Output function names follow the schema: `${prefix}_${methodName}`.
 */
function exportFunctions(controller, prefix) {
    var exported = {};
    var prototype = Object.getPrototypeOf(controller);
    // Get ONLY the controller's actual methods (remove inherited Object methods)
    var methodNames = Object.getOwnPropertyNames(prototype).filter(function (key) {
        if (key === "constructor")
            return false;
        var value = controller[key];
        return (typeof value === "function" &&
            ![
                "__defineGetter__",
                "__defineSetter__",
                "__lookupGetter__",
                "__lookupSetter__",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toString",
                "valueOf",
                "__proto__",
            ].includes(key));
    });
    var _loop_1 = function (methodName) {
        var functionName = "".concat(prefix, "_").concat(methodName);
        exported[functionName] = functions.https.onRequest(function (req, res) { return controller[methodName](req, res); });
    };
    for (var _i = 0, methodNames_1 = methodNames; _i < methodNames_1.length; _i++) {
        var methodName = methodNames_1[_i];
        _loop_1(methodName);
    }
    return exported;
}
