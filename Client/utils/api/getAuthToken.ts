// src/utils/getAuthToken.ts
import { auth } from "@/firebaseConfig";

export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(true); // refreshes if expired
};