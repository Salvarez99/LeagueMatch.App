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
import { LOG, logObjectDeep } from "./../../utils/logger";

export default function Lobby() {
  const { id, gameMap, gameMode } = useLocalSearchParams();
  const { user, loading } = useAuth();
  const uid = user?.uid;
  const [lobby, setLobby] = useState(null);


  const onLeave = async () => {
    try {
      LOG.debug(`USER ${uid} IS ATTEMPTING TO LEAVE LOBBY ${id}`);
      const res = await lobbyApi.leaveLobby(id, uid);
      LOG.debug(`LOBBY LEFT SUCCESSFULLY`);

      router.back();
    } catch (err) {
      LOG.error("Error creating lobby (backend responded):", {
        status: err.response.status,
        data: err.response.data,
      });
    }
  };

  const onReady = async () => {
    try {
      const lobbyId = Array.isArray(id) ? id[0] : id;

      LOG.debug(
        `USER ${uid} IS ATTEMPTING TO UPDATE READY STATUS IN LOBBY ${lobbyId}`
      );

      await lobbyApi.updatePlayerReady(lobbyId, uid);

      LOG.debug(`USER ${uid} READY STATUS UPDATED SUCCESSFULLY`);
    } catch (err) {
      LOG.error("Error updated ready status", {
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const updateDiscordLink = async (newLink) => {
    try {
      const lobbyId = Array.isArray(id) ? id[0] : id;
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { discordLink: newLink });
      LOG.debug("Discord link updated:", newLink);
    } catch (error) {
      LOG.error("❌ Failed to update Discord link:", error);
    }
  };

  useEffect(() => {
    LOG.debug(`ATTEMPTING TO LISTEN TO DOC ID: ${id}`);
    if (id) {
      const lobbyId = Array.isArray(id) ? id[0] : id;

      const unsub = onSnapshot(
        doc(db, "lobbies", lobbyId),
        (snapshot) => {
          LOG.debug("SNAPSHOT RECEIVED");

          if (snapshot.exists()) {
            const data = snapshot.data();
            setLobby(data);

            const isInLobby = data.players.some((player) => player.uid === uid);
            if(!isInLobby){
              router.back();
              return;
            }

            logObjectDeep("Players", data.players);
            LOG.debug(`isActive:`, data.isActive);
          } else {
            LOG.debug(`Lobby doc no longer exists.`);
            router.back();
          }
        },
        (error) => {
          LOG.error("Error listening to lobby:", error);
        }
      );

      return () => unsub();
    }
  }, [id]);

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
        status={lobby?.players?.find((player)=> player.uid === uid)?.ready}
      />
    </SafeAreaView>
  );
}
