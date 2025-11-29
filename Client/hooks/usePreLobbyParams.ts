import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/authContext";

// Define the expected query params for this screen
interface PreLobbyQueryParams {
  mode?: string;
}

export function usePreLobbyParams() {
  const { mode } = useLocalSearchParams() as PreLobbyQueryParams;
  const { user, appUser } = useAuth();

  return {
    uid: user?.uid ?? null,
    mode: mode ?? null,
    hasRiotId: !!appUser?.riotId,
    appUser,
  };
}
