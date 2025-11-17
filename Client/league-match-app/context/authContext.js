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
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devRedirected, setDevRedirected] = useState(false);

  const lastUserRef = useRef(null);
  const lastAppJSON = useRef(null);

  // ------------------------------
  // AUTH LISTENER
  // ------------------------------

  useEffect(() => {
    LOG.auth("Auth listener initialized");

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      // Log only when user actually changes
      if (currentUser?.uid !== lastUserRef.current) {
        LOG.auth("Auth state →", currentUser?.uid || "null");
        lastUserRef.current = currentUser?.uid || null;
      }

      setUser(currentUser);
      setLoading(false);

      // Attach Firestore listener
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        return onSnapshot(
          userRef,
          (snapshot) => {
            const data = snapshot.data() || null;

            // Log only if Firestore data actually changed
            const json = JSON.stringify(data);
            if (json !== lastAppJSON.current) {
              LOG.store("Firestore user updated:");
              logObjectDeep("appUser", data);
              lastAppJSON.current = json;
            }

            setAppUser(data);
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
  // DEV MODE AUTH
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

        if (DEV_CONFIG.AUTO_lINK_RIOT_ID) {
          LOG.dev("Linking Riot ID…");
          await userApi.updateUser({
            uid: auth.currentUser.uid,
            riotId: DEV_CONFIG.TEST_RIOT_ID,
          });
        }
      } catch (err) {
        LOG.error("Dev mode error:", err);
      }
    };

    autoAuth();
  }, []);

  // ------------------------------
  // DEV MODE REDIRECT
  // ------------------------------

  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;
    if (!user || !appUser) return;
    if (devRedirected) return;

    // Redirect once
    LOG.dev("Redirecting → /menu/menu");
    setDevRedirected(true);
    router.replace("/menu/menu");
  }, [user, appUser]);

  return (
    <AuthContext.Provider value={{ user, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
