import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

const AuthContext = createContext({
  user: null,       // Firebase Auth user
  appUser: null,    // Firestore user document
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [appUser, setAppUser] = useState(null); // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 Setting up auth listener");

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If we have a Firebase-authenticated user → setup Firestore listener
      if (currentUser) {
        console.log("👤 Listening to Firestore user doc:", currentUser.uid);

        const userRef = doc(db, "users", currentUser.uid);

        const unsubFirestore = onSnapshot(
          userRef,
          (snapshot) => {
            console.log("📄 Firestore user doc updated:", snapshot.data());
            setAppUser(snapshot.data() || null);
          },
          (error) => {
            console.log("🔥 Error listening to user doc:", error);
          }
        );

        // Return Firestore listener cleanup
        return unsubFirestore;
      } else {
        setAppUser(null);
      }
    });

    return () => {
      console.log("🔥 Cleaning up auth listener");
      unsubAuth();
    };
  }, []);

  console.log("🔥 AuthProvider render - appUser:", appUser);

  return (
    <AuthContext.Provider value={{ user, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
