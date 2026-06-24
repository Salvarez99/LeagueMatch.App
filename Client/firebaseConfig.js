import { initializeApp } from "firebase/app";
import { connectAuthEmulator, initializeAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore";
import {
  authEmulatorUrl,
  firestoreEmulatorHost,
  firestoreEmulatorPort,
} from "./utils/config";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  databaseUrl: process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export const auth = initializeAuth(app);

connectAuthEmulator(auth, authEmulatorUrl);
connectFirestoreEmulator(db, firestoreEmulatorHost, firestoreEmulatorPort);
