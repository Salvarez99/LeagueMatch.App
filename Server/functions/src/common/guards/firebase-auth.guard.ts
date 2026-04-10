import { Injectable, UnauthorizedException } from "@nestjs/common";
import { auth } from "../../firebaseConfig";

export interface AuthUser {
  uid: string;
  email?: string;
}

@Injectable()
export class FirebaseAuthGuard {
  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid Authorization header format");
    }

    try {
      const decoded = await auth.verifyIdToken(token);
      request.user = {
        uid: decoded.uid,
        email: decoded.email,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
