import { Platform } from "react-native";

const FUNCTIONS_PORT = 5001;
const FIRESTORE_PORT = 8080;
const AUTH_PORT = 9099;
const FUNCTIONS_BASE_PATH = "league-match-app/us-central1/api";

const normalizeHost = (value?: string) => {
  if (!value) return undefined;

  return value
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
};

const resolveLocalHost = () => {
  const explicitHost = normalizeHost(
    process.env.EXPO_PUBLIC_LOCAL_HOST ||
      process.env.EXPO_PUBLIC_FIRESTORE_EMU_HOST ||
      process.env.EXPO_PUBLIC_API_HOST,
  );

  if (explicitHost) return explicitHost;

  if (Platform.OS === "android") return "10.0.2.2";
  if (Platform.OS === "ios") return "127.0.0.1";
  return "localhost";
};

const resolveUrl = (url: string | undefined, fallback: string) => {
  if (!url) return fallback;

  try {
    const parsed = new URL(url);
    const host = normalizeHost(parsed.hostname);

    if (!host) return fallback;

    if (["localhost", "127.0.0.1", "10.0.2.2", "0.0.0.0"].includes(host)) {
      parsed.hostname = resolveLocalHost();
      return parsed.toString();
    }

    return url;
  } catch {
    return fallback;
  }
};

export const localHost = resolveLocalHost();

export const apiBaseUrl = resolveUrl(
  process.env.EXPO_PUBLIC_API_URL,
  `http://${localHost}:${FUNCTIONS_PORT}/${FUNCTIONS_BASE_PATH}`,
);

export const firestoreEmulatorHost = localHost;
export const firestoreEmulatorPort = Number(
  process.env.EXPO_PUBLIC_FIRESTORE_PORT || FIRESTORE_PORT,
);
export const authEmulatorUrl = `http://${localHost}:${process.env.EXPO_PUBLIC_FIREBASE_AUTH_PORT || AUTH_PORT}`;
