import { AuthUser } from "../auth/types/authUser";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
