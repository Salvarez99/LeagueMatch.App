import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { auth, db } from "@/firebaseConfig";
import { userApi } from "@/utils/api/userApi";
import { DEV_CONFIG } from "@/devConfig";
import { LOG, logObjectDeep } from "@/utils/logger";

import type { AppUser, AuthUser } from "@/types/user";

interface AuthContextValue {
  user: AuthUser;
  appUser: AppUser | null;
  authLoading: boolean;
  appUserLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  appUser: null,
  authLoading: true,
  appUserLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [appUserLoading, setAppUserLoading] = useState<boolean>(true);

  const [devRedirected, setDevRedirected] = useState<boolean>(false);
  const [riotLinked, setRiotLinked] = useState<boolean>(false);

  const lastUserRef = useRef<string | null>(null);
  const lastAppJSON = useRef<string | null>(null);

  // AUTH LISTENER
  useEffect(() => {
    LOG.auth("Auth listener initialized");

    const unsubAuth = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        if (currentUser?.uid !== lastUserRef.current) {
          LOG.auth("Auth state →", currentUser?.uid || "null");
          lastUserRef.current = currentUser?.uid || null;
        }

        setAppUserLoading(true);
        setUser(currentUser);
        setAuthLoading(false);

        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);

          return onSnapshot(
            userRef,
            (snapshot) => {
              const data = snapshot.data() as AppUser | undefined;
              const json = JSON.stringify(data);

              if (json !== lastAppJSON.current) {
                LOG.store("Firestore user updated:");
                logObjectDeep("appUser:", data ?? null);
                lastAppJSON.current = json;
              }

              setAppUser(data ?? null);
              setAppUserLoading(false);
            },
            (err) => LOG.error("Firestore user error:", err)
          );
        } else {
          setAppUser(null);
        }
      }
    );

    return () => {
      LOG.auth("Auth listener cleaned up");
      unsubAuth();
    };
  }, []);

  // DEV MODE LOGIN
  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;

    const autoAuth = async () => {
      try {
        LOG.dev("Dev mode login starting…");

        try {
          await signInWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );
          LOG.dev("Dev mode user signed in");
        } catch {
          LOG.dev("Creating dev user…");

          const cred = await createUserWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );

          await userApi.createUser({
            uid: cred.user.uid,
            email: DEV_CONFIG.TEST_EMAIL,
            username: "DevTester",
          });
        }
      } catch (err) {
        LOG.error("Dev mode error:", err);
      }
    };

    autoAuth();
  }, []);

  // DEV MODE LINK RIOT ID
  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!user || !appUser) return;
    if (riotLinked) return;

    const shouldLink = DEV_CONFIG.AUTO_lINK_RIOT_ID && !appUser.riotId;

    if (shouldLink) {
      LOG.dev("Linking Riot ID…");
      setRiotLinked(true);

      userApi.updateUser({
        uid: user.uid,
        riotId: DEV_CONFIG.TEST_RIOT_ID,
      });
    }
  }, [user, appUser]);

  // DEV MODE REDIRECT
  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!user || !appUser) return;
    if (devRedirected) return;

    LOG.dev("Redirecting → /menu/menu");
    setDevRedirected(true);
    router.replace("/menu/menu");
  }, [user, appUser]);

  return (
    <AuthContext.Provider
      value={{ user, appUser, authLoading, appUserLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
