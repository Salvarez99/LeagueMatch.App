import { useAuth } from "@/context/authContext";
import { useLocalSearchParams } from "expo-router";

export function useLobbyParams() {
  const params = useLocalSearchParams();
  const { appUser } = useAuth();

  // 🧱 Guarantee appUser exists
  if (!appUser) {
    throw new Error(
      "AppUser must be loaded before accessing the Lobby screen."
    );
  }

  const lobbyId = params.id;
  const gameMap = params.gameMap;
  const gameMode = params.gameMode;

  // 🧱 Narrow route params to guaranteed strings
  if (typeof lobbyId !== "string") {
    throw new Error("Missing or invalid route param: id");
  }
  if (typeof gameMap !== "string") {
    throw new Error("Missing or invalid route param: gameMap");
  }
  if (typeof gameMode !== "string") {
    throw new Error("Missing or invalid route param: gameMode");
  }

  return {
    lobbyId,
    gameMap,
    gameMode,
    currentUid: appUser.id,
  };
}
