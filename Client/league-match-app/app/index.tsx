import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { auth } from "@/firebaseConfig";
import { styles } from "@/styles/indexStyle";
import { userApi } from "@/utils/api/userApi";

// --- Types ---
type CreateUserPayload = {
  uid: string;
  email: string;
  username: string;
};

export default function Index() {
  // ----- State -----
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ----- Auth Context -----
  const { user, authLoading, appUser, appUserLoading } = useAuth();
  const hasRiotId = !!appUser?.riotId;

  const router = useRouter();

  // ----- Handler -----
  const handleAuth = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (!isLogin) {
        // SIGN UP FLOW
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;
        console.log("✅ User created in Firebase:", firebaseUser.uid);

        // Create user in Firestore (through your backend API)
        const payload: CreateUserPayload = {
          uid: firebaseUser.uid,
          email: email,
          username: "Generic Username",
        };

        await userApi.createUser(payload);
        console.log("✅ User profile created in database");

        // Wait for auth propagation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        router.push("/riotLink");
      } else {
        // LOGIN FLOW
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ User signed in");

        // Wait for auth state to propagate
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (hasRiotId) {
          router.replace("/menu/menu");
        } else {
          router.replace("/riotLink");
        }
      }
    } catch (err: any) {
      console.log("❌ Auth error:", {
        errorCode: err.code,
        errorMessage: err.message,
      });
      Alert.alert("Error", err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ----- Auto-Redirect on Auth Load -----
  useEffect(() => {
    if (authLoading || appUserLoading) return;

    if (user) {
      const hasRiotId = !!appUser?.riotId;

      if (hasRiotId) {
        router.replace("/menu/menu");
      } else {
        router.replace("/riotLink");
      }
    }
  }, [user, authLoading, appUserLoading, appUser]);

  // ----- UI -----
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Sign in to continue" : "Sign up to get started"}
          </Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password (Sign Up Only) */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}

          {/* Forgot Password */}
          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.authButton, loading && { opacity: 0.7 }]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {isLogin ? "Log In" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Toggle Login / Signup */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchButtonText}>
                {isLogin ? "Sign Up" : "Log In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
