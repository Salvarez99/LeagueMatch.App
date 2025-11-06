import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from "firebase/firestore";

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

const EMULATOR_HOST = process.env.EXPO_PUBLIC_FIRESTORE_EMU_HOST;
const FIRESTORE_PORT = process.env.EXPO_PUBLIC_FIRESTORE_PORT;

connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_PORT);
