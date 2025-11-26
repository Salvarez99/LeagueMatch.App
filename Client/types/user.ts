import type { User as FirebaseUser } from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string;
  username: string;
  riotId?: string | null;
  // add more fields as needed
}

export type AuthUser = FirebaseUser | null;
