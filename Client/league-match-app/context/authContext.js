import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("🔥 Setting up auth listener");
    console.log("🔥 Auth config:", {
      hasAuth: !!auth,
      authType: auth?.constructor?.name
    });
    
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔥🔥🔥 AUTH STATE CHANGED 🔥🔥🔥");
      console.log("🔥 User:", currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email
      } : "null");
      
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.log("🔥 Auth listener error:", error);
      setLoading(false);
    });
    
    return () => {
      console.log("🔥 Cleaning up auth listener");
      unsub();
    };
  }, []);
  
  console.log("🔥 AuthProvider render - User:", user?.uid || "null", "Loading:", loading);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};