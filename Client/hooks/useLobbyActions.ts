import { doc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { lobbyApi } from "../utils/api/lobbyApi";
import { LOG } from "../utils/logger";
import type { AxiosError } from "axios";


export function useLobbyActions(lobbyId: string, uid: string) {
  // Leave lobby
  const onLeave = async () => {
    LOG.debug("onLeave triggered", { uid, lobbyId });

    try {
      await lobbyApi.leaveLobby(lobbyId, uid);
      router.back();
    } catch (err:unknown) {
      const error = err as AxiosError;
      LOG.error("Leave lobby failed", error.response?.data);
    }
  };

  // Ready toggle
  const onReady = async () => {
    LOG.debug("Toggling ready", { uid, lobbyId });

    try {
      await lobbyApi.updatePlayerReady(lobbyId, uid);
    } catch (err:unknown) {
      const error = err as AxiosError;
      LOG.error("Ready update failed", error.response?.data);
    }
  };

  // Kick player
  const onKickPlayer = async (targetUid: string) => {
    LOG.debug("Host kicking player", {
      host: uid,
      target: targetUid,
      lobbyId,
    });

    try {
      await lobbyApi.kickPlayer(lobbyId, uid, { uid: targetUid });
    } catch (err:unknown) {
      const error = err as AxiosError;
      LOG.error("Kick failed", error.response?.data);
    }
  };

  // Update Discord link
  const updateDiscordLink = async (newLink: string) => {
    LOG.debug("Updating Discord link", { newLink });

    try {
      const ref = doc(db, "lobbies", lobbyId);
      await updateDoc(ref, { discordLink: newLink });
    } catch (err:unknown) {
      const error = err as AxiosError;
      LOG.error("Discord update failed", err);
    }
  };

  const handleUpdateChampion = async (
    playerUid: string,
    championId: string
  ) => {
    try {
      await lobbyApi.updateChampion(lobbyId, playerUid, { championId });
      console.log("Champion updated", playerUid, championId);
    } catch (err:unknown) {
      const error = err as AxiosError;
      console.error("Failed to update champion:", error);
    }
  };

  return {
    onLeave,
    onReady,
    onKickPlayer,
    updateDiscordLink,
    handleUpdateChampion,
  };
}
