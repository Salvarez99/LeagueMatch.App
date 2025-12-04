import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { DEV_CONFIG } from "@/devConfig";
import { auth, db } from "@/firebaseConfig";
import { userApi } from "@/utils/api/userApi";
import { LOG, logObjectDeep } from "@/utils/logger";

import type { AppUser, AuthUser } from "@/types/User";
import type { IUser } from "@leaguematch/shared";

interface AuthContextValue {
  authUser: AuthUser;
  appUser: AppUser | null;
  authLoading: boolean;
  appUserLoading: boolean;
  hasRiotLinked: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  authUser: null,
  appUser: null,
  authLoading: true,
  appUserLoading: true,
  hasRiotLinked: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [appUserLoading, setAppUserLoading] = useState<boolean>(true);

  const [devRedirected, setDevRedirected] = useState<boolean>(false);
  const [hasRiotLinked, setHasRiotLinked] = useState<boolean>(false);

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
        setAuthUser(currentUser);
        setAuthLoading(false);

        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);

          return onSnapshot(
            userRef,
            (snapshot) => {
              const data = snapshot.data() as IUser | undefined;

              if (!data) {
                setAppUserLoading(false);
                setAppUser(null);
                return;
              }

              const json = JSON.stringify(data);

              if (json !== lastAppJSON.current) {
                LOG.store("Firestore authUser updated:");
                logObjectDeep("appUser:", data ?? null);
                lastAppJSON.current = json;
              }

              setAppUser({ id: snapshot.id, ...data } as AppUser);
              if (data.riotId) setHasRiotLinked(true);

              setAppUserLoading(false);
            },
            (err) => LOG.error("Firestore authUser error:", err)
          );
        } else {
          setAppUser(null);
          setHasRiotLinked(false);
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
          LOG.dev("Dev mode authUser signed in");
        } catch {
          LOG.dev("Creating dev user…");

          const cred = await createUserWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );

          await userApi.createUser({
            id: cred.user.uid,
            email: DEV_CONFIG.TEST_EMAIL,
            username: DEV_CONFIG.TEST_USERNAME,
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
    if (!authUser || !appUser) return;
    if (hasRiotLinked) return;

    const shouldLink = DEV_CONFIG.AUTO_lINK_RIOT_ID && !appUser.riotId;

    if (shouldLink) {
      LOG.dev("Linking Riot ID…");
      setHasRiotLinked(true);

      userApi.updateUser({
        id: authUser.uid,
        riotId: DEV_CONFIG.TEST_RIOT_ID,
      });
    }
  }, [authUser, appUser]);

  // DEV MODE REDIRECT
  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!authUser || !appUser) return;
    if (devRedirected) return;

    LOG.dev("Redirecting → /menu/menu");
    setDevRedirected(true);
    router.replace("/menu/menu");
  }, [authUser, appUser]);

  return (
    <AuthContext.Provider
      value={{ authUser, appUser, authLoading, appUserLoading, hasRiotLinked }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
