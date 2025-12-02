import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/authContext";

export function usePreLobbyParams() {
  const params = useLocalSearchParams();
  const { appUser, hasRiotLinked } = useAuth();

  if (!appUser) {
    throw new Error("AppUser must be loaded before entering PreLobby.");
  }

  const mode = params.mode;

  if (typeof mode !== "string") {
    throw new Error("Missing or invalid route param: mode");
  }

  return {
    mode,
    hasRiotLinked,
    appUser,
  };
}
