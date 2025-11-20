import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/authContext";

export function useLobbyParams() {
  const { id, gameMap, gameMode, justJoined } = useLocalSearchParams();
  const { user } = useAuth();

  return {
    id: id,
    gameMap,
    gameMode,
    justJoined: !!justJoined,
    uid: user?.uid,
  };
}
