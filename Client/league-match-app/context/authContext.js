import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { userApi } from "../utils/api/userApi";
import { DEV_CONFIG } from "./../devConfig";
import { LOG, logObjectDeep, logUserObject } from "./../utils/logger";

const AuthContext = createContext({
  user: null, // Firebase Auth user
  appUser: null, // Firestore user document
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth user
  const [appUser, setAppUser] = useState(null); // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LOG.auth("Setting up auth listener...");

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      LOG.auth("Firebase auth state changed:", currentUser?.uid || "null");
      setUser(currentUser);
      setLoading(false);
      // If we have a Firebase-authenticated user → setup Firestore listener
      if (currentUser) {
        LOG.store(`Listening to Firestore user doc → ${currentUser.uid}`);

        const userRef = doc(db, "users", currentUser.uid);

        const unsubFirestore = onSnapshot(
          userRef,
          (snapshot) => {
            LOG.store("User Firestore doc updated:");
            logObjectDeep("doc", snapshot.data());

            setAppUser(snapshot.data() || null);
          },
          (error) => {
            LOG.error("Error listening to user doc:", error);
          }
        );

        // Return Firestore listener cleanup
        return unsubFirestore;
      } else {
        setAppUser(null);
      }
    });

    return () => {
      LOG.auth("Cleaning up auth listener");
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    if (!DEV_CONFIG.DEV_MODE) return;

    const autoAuth = async () => {
      try {
        console.log("🟣 DEV MODE ENABLED: logging in development user…");

        try {
          await signInWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );
          console.log("🟣 Signed in test user.");
        } catch {
          // If login fails, create the user
          console.log("🟣 Creating test dev user…");
          await createUserWithEmailAndPassword(
            auth,
            DEV_CONFIG.TEST_EMAIL,
            DEV_CONFIG.TEST_PASSWORD
          );

          // Also create Firestore user entry
          await userApi.createUser({
            uid: auth.currentUser.uid,
            email: DEV_CONFIG.TEST_EMAIL,
            username: "DevTester",
          });
        }

        if (DEV_CONFIG.AUTO_lINK_RIOT_ID) {
          console.log("🟣 Auto-linking Riot ID…");
          await userApi.updateUser({
            uid: auth.currentUser.uid,
            riotId: DEV_CONFIG.TEST_RIOT_ID,
          });
        }
      } catch (err) {
        console.warn("Dev auto-auth error:", err);
      }
    };

    autoAuth();
  }, []);

  logUserObject("appUser", appUser);

  return (
    <AuthContext.Provider value={{ user, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
