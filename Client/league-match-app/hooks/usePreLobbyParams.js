import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/authContext";

export function usePreLobbyParams() {
  const { mode } = useLocalSearchParams();
  const { user, appUser } = useAuth();

  return {
    uid: user?.uid,
    mode,
    hasRiotId: !!appUser?.riotId,
    appUser,
  };
}
