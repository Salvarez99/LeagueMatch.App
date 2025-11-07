import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import DiscordButton from "../../components/lobby/DiscordButton";
import LobbyButtons from "../../components/lobby/LobbyButtons";
import PlayerCards from "../../components/lobby/PlayerCards";
import { db } from "../../firebaseConfig";
import { lobbyApi } from "../../utils/api/lobbyApi";

export default function Lobby() {
  const { id, gameMap, gameMode } = useLocalSearchParams();

  const onLeave = async () => {
    const uid = "1";
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
      <HostCard style={styles.hostCardContainerStyle} />
      <PlayerCards style={styles.playerCardsContainerStyle} />
      <DiscordButton style={styles.discordButtonContainerStyle} />
      <LobbyButtons
        style={styles.lobbyButtonsContainerStyle}
        onLeave={onLeave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  gameModeHeaderContainerStyle: {
    flex: 1.3,
  },
  hostCardContainerStyle: {
    flex: 3,
  },
  playerCardsContainerStyle: {
    flex: 9,
  },
  discordButtonContainerStyle: {
    flex: 1.5,
  },
  lobbyButtonsContainerStyle: {
    flex: 1.3,
  },
});
