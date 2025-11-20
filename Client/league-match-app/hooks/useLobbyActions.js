import { doc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { lobbyApi } from "../utils/api/lobbyApi";
import { LOG } from "../utils/logger";

export function useLobbyActions(lobbyId, uid) {
  // Leave lobby
  const onLeave = async () => {
    LOG.debug("onLeave triggered", { uid, lobbyId });

    try {
      await lobbyApi.leaveLobby(lobbyId, uid);
      router.back();
    } catch (err) {
      LOG.error("Leave lobby failed", err.response?.data);
    }
  };

  // Ready toggle
  const onReady = async () => {
    LOG.debug("Toggling ready", { uid, lobbyId });

    try {
      await lobbyApi.updatePlayerReady(lobbyId, uid);
    } catch (err) {
      LOG.error("Ready update failed", err.response?.data);
    }
  };

  // Kick player
  const onKickPlayer = async (targetUid) => {
    LOG.debug("Host kicking player", {
      host: uid,
      target: targetUid,
      lobbyId,
    });

    try {
      await lobbyApi.kickPlayer(lobbyId, uid, { uid: targetUid });
    } catch (err) {
      LOG.error("Kick failed", err.response?.data);
    }
  };

  // Update Discord link
  const updateDiscordLink = async (newLink) => {
    LOG.debug("Updating Discord link", { newLink });

    try {
      const ref = doc(db, "lobbies", lobbyId);
      await updateDoc(ref, { discordLink: newLink });
    } catch (err) {
      LOG.error("Discord update failed", err);
    }
  };

  return {
    onLeave,
    onReady,
    onKickPlayer,
    updateDiscordLink,
  };
}
