import type { User as FirebaseUser } from "firebase/auth";
import { IUser } from "@leaguematch/shared";

export interface AppUser extends IUser{
  id: string;
}

export type AuthUser = FirebaseUser | null;
