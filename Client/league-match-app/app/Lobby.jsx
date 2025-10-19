import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../components/common/GameModeHeader";
import HostCard from "../components/common/HostCard";
import DiscordButton from "../components/lobby/DiscordButton";
import LobbyButtons from "../components/lobby/LobbyButtons";
import PlayerCards from "../components/lobby/PlayerCards";

export default function Lobby() {
  return (
    <SafeAreaView
      style={styles.containerStyle}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader style={{ flex: 1.3 }} />
      <HostCard style={{ flex: 3 }} />
      <PlayerCards style={{ flex: 9 }} />
      <DiscordButton style={{ flex: 1.5 }} />
      <LobbyButtons style={{ flex: 1.3 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
