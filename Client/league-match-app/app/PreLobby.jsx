import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FilterButton from "../components/FilterButton";
import GameModeCarousel from "../components/GameModeCarousel";
import GameModeHeader from "../components/GameModeHeader";
import HostCard from "../components/HostCard";
import LobbySearchButton from "../components/LobbySearchButton";
import PickChampionButton from "../components/PickChampionButton";
import PickPositionButton from "../components/PickPositionButton";
import Screen from "../utils/dimensions";

export default function PreLobby() {
  return (
    <SafeAreaView
      style={styles.containerStyle}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader style={styles.gameModeHeaderContainerStyle} />

      <HostCard style={styles.hostCardContainerStyle} />

      <GameModeCarousel
        style={styles.carouselContainerStyle}
        itemStyle={styles.carouselItemStyle}
      />

      <View style={styles.champPosContainerStyle}>
        <PickChampionButton />
        <PickPositionButton />
      </View>
      <View style={styles.lobbyFilterContainerStyle}>
        <LobbySearchButton />
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
    // backgroundColor: "green",
  },
  carouselContainerStyle: {
    flex: 10,
    padding: 8,
    paddingHorizontal: 0,
    // backgroundColor: "purple",
  },
  carouselItemStyle: {
    height: Screen.height * 0.445,
  },
  champPosContainerStyle: {
    flex: 2,
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  lobbyFilterContainerStyle: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    paddingVertical: 0,
    // backgroundColor: "blue",
  },
});
