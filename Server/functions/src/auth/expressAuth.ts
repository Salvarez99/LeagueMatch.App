import { Request } from "express";
import { firebaseAuthHandler } from "./firebaseAuthHandler";
import { AuthUser } from "./types/authUser";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthUser> {
  console.log("🔐 expressAuthentication called");
  console.log("securityName:", securityName);
  console.log("authorization header:", request.headers.authorization);

  try {
    if (securityName !== "firebaseAuth") {
      throw new Error(`Unknown security scheme: ${securityName}`);
    }

    // TEMP: force fail if header missing
    if (!request.headers.authorization) {
      throw {
        status: 401,
        message: "Missing Authorization header",
      };
    }

    if (securityName === "firebaseAuth") {
      return firebaseAuthHandler(request);
    }
  } catch (err) {
    console.error("❌ AUTH ERROR:", err);
    throw err;
  }

  // throw {
  //   status: 401,
  //   message: "Unknown security scheme",
  // };
}
