import * as functions from "firebase-functions";
import { Request, Response } from "express";

/**
 * Auto-exports only the controller's own methods as Firebase HTTPS functions.
 * Filters out inherited Object methods and non-functions.
 */
export function exportController(
  controller: Record<string, any>,
  prefix: string = ""
) {
  const exported: Record<string, any> = {};

  const prototype = Object.getPrototypeOf(controller);

  const methodNames = Object.getOwnPropertyNames(prototype).filter((key) => {
    const value = controller[key];

    // Skip constructor
    if (key === "constructor") return false;

    // Must be a function
    if (typeof value !== "function") return false;

    // Skip inherited object methods
    if (
      [
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
      ].includes(key)
    ) {
      return false;
    }

    return true;
  });

  for (const key of methodNames) {
  const functionName = prefix ? `${prefix}_${key}` : key;
  console.log(`function name: ${functionName}`);

  exported[functionName] = functions.https.onRequest(
    (req: Request, res: Response) => controller[key](req, res)
  );
}


  return exported;
}
