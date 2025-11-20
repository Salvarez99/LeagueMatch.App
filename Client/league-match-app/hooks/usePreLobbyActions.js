import { useRouter } from "expo-router";
import { lobbyApi } from "../utils/api/lobbyApi";
import { LOG } from "../utils/logger";

export function usePreLobbyActions({
  uid,
  mode,
  gameMap,
  gameMode,
  position,
  championId,
  rankFilter,
  hasRiotId,
  setRiotModalOpen,
}) {
  const router = useRouter();

  const handleSubmit = async () => {
    if (!hasRiotId) {
      setRiotModalOpen(true);
      return;
    }

    if (mode === "host") {
      return createLobby();
    }
    if (mode === "join") {
      return joinLobby();
    }
  };

  async function createLobby() {
    try {
      const res = await lobbyApi.createLobby({
        hostId: uid,
        hostPosition: position,
        gameMap,
        gameMode,
        championId,
        rankFilter,
      });

      const id = res.data.id;

      router.push({
        pathname: `/lobby/${id}`,
        params: { gameMap, gameMode },
      });
    } catch (err) {
      const code =
        err.response?.data?.error || err.response?.data?.message || "Unknown";

      if (code.includes("Riot ID")) {
        setRiotModalOpen(true);
      }

      LOG.error("Create lobby failed", err.response?.data);
    }
  }

  async function joinLobby() {
    try {
      const findRes = await lobbyApi.findLobby(uid, {
        gameMap,
        gameMode,
        desiredPosition: position,
        ranks: rankFilter,
      });

      const lobbyId = findRes.data.id;

      await lobbyApi.joinLobby(lobbyId, {
        uid,
        position,
        championId,
      });

      router.push({
        pathname: `/lobby/${lobbyId}`,
        params: {
          gameMap,
          gameMode,
          justJoined: "true",
        },
      });
    } catch (err) {
      LOG.error("Join lobby failed", err.response?.data);
    }
  }

  return { handleSubmit };
}
