import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../components/common/GameModeHeader";
import HostCard from "../components/common/HostCard";
import FilterButton from "../components/preLobby/FilterButton";
import GameModeCarousel from "../components/preLobby/GameModeCarousel";
import LobbySearchButton from "../components/preLobby/LobbySearchButton";
import PickChampionButton from "../components/preLobby/PickChampionButton";
import PickPositionButton from "../components/preLobby/PickPositionButton";
import Screen from "../utils/dimensions";

export default function PreLobby() {
  const [gameMap, setGameMap] = useState("");
  const [gameMode, setGameMode] = useState("");

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

      <GameModeCarousel
        style={styles.carouselContainerStyle}
        itemStyle={styles.carouselItemStyle}
        setGameMap={setGameMap}
        setGameMode={setGameMode}
      />

      <View style={styles.champPosContainerStyle}>
        <PickChampionButton />
        <PickPositionButton />
      </View>
      <View style={styles.lobbyFilterContainerStyle}>
        <LobbySearchButton gameMap={gameMap} gameMode={gameMode} />
        <FilterButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // backgroundColor: "brown",
  },
  gameModeHeaderContainerStyle: {
    flex: 1.3,
    padding: 8,
    paddingBottom: 0,
    // backgroundColor: "red",
  },
  hostCardContainerStyle: {
    flex: 3,
    // backgroundColor: "pink",
  },
  carouselContainerStyle: {
    flex: 10,
    padding: 0,
    margin: 0,
    // backgroundColor: "purple",
  },
  carouselItemStyle: {
    height: Screen.height * 0.445,
  },
  champPosContainerStyle: {
    flex: 1.8,
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  lobbyFilterContainerStyle: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    // backgroundColor: "blue",
  },
});
