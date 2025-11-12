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
import { lobbyApi } from "../../utils/api/lobbyApi";
import { useAuth } from "./../../context/authContext";
import { styles } from "./lobbyStyle";

export default function Lobby() {
  const { id, gameMap, gameMode } = useLocalSearchParams();
  const { user, loading } = useAuth();
  const uid = user?.uid;
  const [lobby, setLobby] = useState(null);

  const onLeave = async () => {
    try {
      console.log(`USER ${uid} IS ATTEMPTING TO LEAVE LOBBY ${id}`);
      const res = await lobbyApi.leaveLobby(id, uid);
      console.log(`LOBBY LEFT SUCCESSFULLY`);

      router.back();
    } catch (err) {
      console.error("Error creating lobby (backend responded):", {
        status: err.response.status,
        data: err.response.data,
      });
    }
  };

  const updateDiscordLink = async (newLink) => {
    try {
      const lobbyId = Array.isArray(id) ? id[0] : id;
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, { discordLink: newLink });
      console.log("✅ Discord link updated:", newLink);
    } catch (error) {
      console.error("❌ Failed to update Discord link:", error);
    }
  };

  useEffect(() => {
    console.log(`ATTEMPTING TO LISTEN TO DOC ID: ${id}`);
    if (id) {
      const lobbyId = Array.isArray(id) ? id[0] : id;

      const unsub = onSnapshot(
        doc(db, "lobbies", lobbyId),
        (snapshot) => {
          console.log("SNAPSHOT RECEIVED");

          if (snapshot.exists()) {
            const data = snapshot.data();
            setLobby(data);
            data.players.forEach((player, index) => {
              console.log(`Player ${index}: ${JSON.stringify(player)}`);
            });
            console.log(`isActive:`, data.isActive);
          } else {
            console.log(`Lobby doc no longer exists.`);
          }
        },
        (error) => {
          console.error("Error listening to lobby:", error);
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
      <HostCard style={styles.hostCardContainerStyle} host={lobby?.players?.[0]}/>
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
      />
    </SafeAreaView>
  );
}
