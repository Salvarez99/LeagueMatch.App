import { useRouter } from "expo-router";
import { lobbyApi } from "../utils/api/lobbyApi";
import { LOG } from "../utils/logger";
import type { AxiosError } from "axios";

interface PreLobbyActionsParams {
  uid: string;
  mode: string;
  gameMap: string;
  gameMode: string;
  position: string;
  championId: string;
  rankFilter: string[];
  hasRiotId: boolean;
  setRiotModalOpen: (open: boolean) => void;
}

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
}: PreLobbyActionsParams) {
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
        pathname: `/lobby/[id]`,
        params: { id, gameMap, gameMode },
      });
    } catch (err: unknown) {
      const error = err as AxiosError;
      const code: string | undefined = error?.code;

      if (code?.includes("Riot ID")) {
        setRiotModalOpen(true);
      }

      LOG.error("Create lobby failed", error.response?.data);
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

      const id = findRes.data.id;

      await lobbyApi.joinLobby(id, {
        uid,
        position,
        championId,
      });

      router.push({
        pathname: `/lobby/[id]`,
        params: {
          id,
          gameMap,
          gameMode,
          justJoined: "true",
        },
      });
    } catch (err: unknown) {
      const error = err as AxiosError;
      LOG.error("Join lobby failed", error.response?.data);
    }
  }

  return { handleSubmit };
}
