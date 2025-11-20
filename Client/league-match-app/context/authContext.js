import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { userApi } from "../utils/api/userApi";
import { DEV_CONFIG } from "./../devConfig";
import { LOG, logObjectDeep } from "./../utils/logger";

const AuthContext = createContext({
  user: null,
  appUser: null,
  authLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [appUserLoading, setAppUserLoading] = useState(true);

  const [authLoading, setAuthLoading] = useState(true);
  const [devRedirected, setDevRedirected] = useState(false);

  // Tracks if Riot ID has already been linked this session
  const [riotLinked, setRiotLinked] = useState(false);

  const lastUserRef = useRef(null);
  const lastAppJSON = useRef(null);

  // ------------------------------
  // AUTH LISTENER
  // ------------------------------

  useEffect(() => {
    LOG.auth("Auth listener initialized");

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
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
            const data = snapshot.data() || null;
            const json = JSON.stringify(data);

            if (json !== lastAppJSON.current) {
              LOG.store("Firestore user updated:");
              logObjectDeep("appUser: ", data);
              lastAppJSON.current = json;
            }

            setAppUser(data);
            setAppUserLoading(false);
          },
          (err) => LOG.error("Firestore user error:", err)
        );
      } else {
        setAppUser(null);
      }
    });

    return () => {
      LOG.auth("Auth listener cleaned up");
      unsubAuth();
    };
  }, []);

  // ------------------------------
  // DEV MODE LOGIN (runs once before Firestore loads)
  // ------------------------------

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
          await createUserWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );

          await userApi.createUser({
            uid: auth.currentUser.uid,
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

  // ------------------------------
  // DEV MODE — LINK RIOT ID (fixed)
  // ------------------------------

  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!user || !appUser) return; // wait for Firestore to load fully
    if (riotLinked) return; // prevent multiple updates

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

  // ------------------------------
  // DEV MODE REDIRECT
  // ------------------------------

  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!user || !appUser) return;
    if (devRedirected) return;

    LOG.dev("Redirecting → /menu/menu");
    setDevRedirected(true);
    router.replace("/menu/menu");
  }, [user, appUser]);

  return (
    <AuthContext.Provider value={{ user, appUser, authLoading, appUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
