import * as LobbyRequest from "@/types/ILobbyApiRequest";
import type { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { lobbyApi } from "../utils/api/lobbyApi";
import { LOG } from "../utils/logger";

interface PreLobbyActionsParams {
  currentUid: string;
  mode: string;
  gameMap: string;
  gameMode: string;
  position: string;
  championId: string;
  rankFilter: string[];
  hasRiotLinked: boolean;
  setRiotModalOpen: (open: boolean) => void;
}

export function usePreLobbyActions({
  currentUid,
  mode,
  gameMap,
  gameMode,
  position,
  championId,
  rankFilter,
  hasRiotLinked,
  setRiotModalOpen,
}: PreLobbyActionsParams) {
  const router = useRouter();

  const handleSubmit = async () => {
    if (!hasRiotLinked) {
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
      const payload: LobbyRequest.Create = {
        hostId: currentUid,
        hostPosition: position,
        gameMap,
        gameMode,
        championId,
        rankFilter,
      };
      const res = await lobbyApi.createLobby(payload);

      const id = res.data.id;

      if (!id) {
        throw new Error("Lobby response missing id");
      }

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
      const payload: LobbyRequest.Find = {
        gameMap,
        gameMode,
        desiredPosition: position,
        ranks: rankFilter,
      };
      const findRes = await lobbyApi.findLobby(currentUid, payload);

      const id = findRes.data.id;

      await lobbyApi.joinLobby(id, {
        uid: currentUid,
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
