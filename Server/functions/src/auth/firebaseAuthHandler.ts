import { Request } from "express";
import { auth } from "./../firebaseConfig";
import { AuthUser } from "./types/authUser";

export async function firebaseAuthHandler(
  request: Request
): Promise<AuthUser> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw {
      status: 401,
      message: "Missing Authorization header",
    };
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw {
      status: 401,
      message: "Invalid Authorization header format",
    };
  }

  try {
    const decoded = await auth.verifyIdToken(token);

    return {
      uid: decoded.uid,
      email: decoded.email,
    };
  } catch (err) {
    throw {
      status: 401,
      message: "Invalid or expired token",
    };
  }
}
