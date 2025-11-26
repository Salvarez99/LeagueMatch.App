import * as functions from "firebase-functions";
/**
 * Creates Firebase HTTPS functions for each method of a controller instance.
 * Output function names follow the schema: `${prefix}_${methodName}`.
 */
export function exportFunctions(controller, prefix) {
    const exported = {};
    const prototype = Object.getPrototypeOf(controller);
    // Get ONLY the controller's actual methods (remove inherited Object methods)
    const methodNames = Object.getOwnPropertyNames(prototype).filter((key) => {
        if (key === "constructor")
            return false;
        const value = controller[key];
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
    for (const methodName of methodNames) {
        const functionName = `${prefix}_${methodName}`;
        exported[functionName] = functions.https.onRequest((req, res) => controller[methodName](req, res));
    }
    return exported;
}
