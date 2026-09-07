// src/utils/getAuthToken.ts
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser ?? (await waitForAuthUser());
  if (!user) return null;
  return await user.getIdToken(true); // refreshes if expired
};

const waitForAuthUser = () =>
  new Promise<NonNullable<typeof auth.currentUser> | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
