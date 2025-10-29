import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../components/common/GameModeHeader";
import HostCard from "../components/common/HostCard";
import DiscordButton from "../components/lobby/DiscordButton";
import LobbyButtons from "../components/lobby/LobbyButtons";
import PlayerCards from "../components/lobby/PlayerCards";
import { useLocalSearchParams } from "expo-router";

export default function Lobby() {
  const {gameMap, gameMode} = useLocalSearchParams();
  return (
    <SafeAreaView
      style={styles.containerStyle}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader style={styles.gameModeHeaderContainerStyle} gameMap={gameMap} gameMode={gameMode} />
      <HostCard style={styles.hostCardContainerStyle} />
      <PlayerCards style={styles.playerCardsContainerStyle} />
      <DiscordButton style={styles.discordButtonContainerStyle} />
      <LobbyButtons style={styles.lobbyButtonsContainerStyle} />
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
