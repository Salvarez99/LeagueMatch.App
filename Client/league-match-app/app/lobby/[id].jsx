import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import DiscordButton from "../../components/lobby/DiscordButton";
import LobbyButtons from "../../components/lobby/LobbyButtons";
import PlayerCards from "../../components/lobby/PlayerCards";
import { db } from "../../firebaseConfig";
import { styles } from "../../styles/lobbyStyle";
import { lobbyApi } from "../../utils/api/lobbyApi";
import { useAuth } from "./../../context/authContext";
import { LOG } from "./../../utils/logger";

export default function Lobby() {
  const { id, gameMap, gameMode, justJoined } = useLocalSearchParams();
  const { user } = useAuth();
  const uid = user?.uid;

  const [lobby, setLobby] = useState(null);
  const [joinConfirmed, setJoinConfirmed] = useState(false);


  LOG.debug("🔵 LOBBY SCREEN MOUNTED", {
    id,
    gameMap,
    gameMode,
    uid,
  });

  // USER LEAVE
  const onLeave = async () => {
    LOG.debug("🔴 USER REQUESTED LEAVE", { uid, id });

    try {
      const res = await lobbyApi.leaveLobby(id, uid);
      LOG.debug("🟢 LEAVE SUCCESS — resetting hasJoined", res.data);

      setJoinConfirmed(false);

      router.back();
    } catch (err) {
      LOG.error("❌ LEAVE ERROR", {
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  // READY TOGGLE
  const onReady = async () => {
    LOG.debug("⚪ READY TOGGLE", { uid, lobbyId: id });

    try {
      await lobbyApi.updatePlayerReady(id, uid);
      LOG.debug("🟢 READY UPDATED");
    } catch (err) {
      LOG.error("❌ READY UPDATE ERROR", {
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  // HOST KICKS PLAYER
  const onKickPlayer = async (targetUid) => {
    LOG.debug("🔴 HOST KICKING A PLAYER", {
      host: uid,
      target: targetUid,
      lobbyId: id,
    });

    try {
      await lobbyApi.kickPlayer(id, uid, { uid: targetUid });
      setJoinConfirmed(false);

      LOG.debug("🟢 KICK SUCCESS");
    } catch (err) {
      LOG.error("❌ KICK FAILED", {
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  // UPDATE DISCORD LINK
  const updateDiscordLink = async (newLink) => {
    LOG.debug("🟣 UPDATE DISCORD LINK", { uid, newLink });

    try {
      const lobbyRef = doc(db, "lobbies", id);
      await updateDoc(lobbyRef, { discordLink: newLink });
      LOG.debug("🟢 DISCORD LINK UPDATED", { newLink });
    } catch (error) {
      LOG.error("❌ DISCORD UPDATE FAILED", error);
    }
  };

  // FIRESTORE LISTENER
  useEffect(() => {
    if (!id) return;

    const lobbyId = Array.isArray(id) ? id[0] : id;

    LOG.debug("📡 ATTACHING FIRESTORE LISTENER", { lobbyId, uid });

    const unsub = onSnapshot(doc(db, "lobbies", lobbyId), (snapshot) => {
      LOG.debug("📥 SNAPSHOT RECEIVED");

      // --- 1. LOBBY DELETED ---
      if (!snapshot.exists()) {
        LOG.debug("⚠️ LOBBY DELETED — redirecting");
        setJoinConfirmed(false);
        router.back();
        return;
      }

      const data = snapshot.data();
      const players = data.players || [];
      const kicked = data.kickedPlayers || [];

      setLobby(data);

      const isInLobby = players.some((p) => p.uid === uid);
      const isKicked = kicked.includes(uid);

      LOG.debug("🔍 PLAYER STATUS CHECK", { uid, isInLobby, isKicked });

      // // --- 2. USER KICKED ---
      if (isKicked) {
        LOG.debug("⛔ USER IS IN kickedPlayers ARRAY — redirecting");
        setJoinConfirmed(false);
        router.back();
        return;
      }

      if (!data.isActive) {
        LOG.debug("⚠️ LOBBY IS NOT ACTIVE — redirecting");
        router.back();
        return;
      }

      // --- 3. FIRST CONFIRMATION ---
      if (!joinConfirmed && isInLobby) {
        LOG.debug("🎉 FIRST SNAPSHOT CONFIRMATION — joinConfirmed = true");
        setJoinConfirmed(true);
        return;
      }

      // --- 4. REAL REMOVAL (after join confirmed) ---
      if (joinConfirmed && !isInLobby) {
        LOG.debug("⚠️ USER REMOVED AFTER CONFIRMATION — redirecting");
        setJoinConfirmed(false);
        router.back();
        return;
      }

      LOG.debug("🟢 USER VALID & IN LOBBY — continue rendering");
    });

    return () => {
      LOG.debug("📴 UNMOUNTING FIRESTORE LISTENER");
      unsub();
    };
  }, [id, uid]);

  return (
    <SafeAreaView
      style={styles.containerStyle}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader
        style={styles.gameModeHeaderContainerStyle}
        gameMap={gameMap}
        gameMode={gameMode}
      />
      <HostCard
        style={styles.hostCardContainerStyle}
        host={lobby?.players?.[0]}
        isLobby={true}
        status={lobby?.players?.[0]?.ready}
      />
      <PlayerCards
        style={styles.playerCardsContainerStyle}
        players={lobby?.players?.slice(1) || []}
        maxPlayers={lobby?.maxPlayers}
        isHost={lobby?.hostId === uid}
        onKick={onKickPlayer}
      />
      <DiscordButton
        style={styles.discordButtonContainerStyle}
        isHost={lobby?.hostId === uid}
        discordLink={lobby?.discordLink}
        onUpdateLink={updateDiscordLink}
      />
      <LobbyButtons
        style={styles.lobbyButtonsContainerStyle}
        onLeave={onLeave}
        onReady={onReady}
        status={lobby?.players?.find((player) => player.uid === uid)?.ready}
      />
    </SafeAreaView>
  );
}
