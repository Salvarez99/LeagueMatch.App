import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/authContext";

interface LobbyParams {
  id?: string;
  gameMap?: string;
  gameMode?: string;
  justJoined?: string;
}
export function useLobbyParams() {
  const { id, gameMap, gameMode, justJoined } =
    useLocalSearchParams() as LobbyParams;
  const { authUser } = useAuth();

  return {
    id: id,
    gameMap,
    gameMode,
    justJoined: !!justJoined,
    uid: authUser?.uid,
  };
}
