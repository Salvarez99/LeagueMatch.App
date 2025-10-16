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

export default function HostLobby() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "yellow",
      }}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader
        style={{
          flex: 1.2,
          display: "flex",
          margin: 10,
          paddingRight: 10,
          // backgroundColor: "red",
        }}
      />

      <HostCard
        style={{
          flex: 3,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      <GameModeCarousel
        style={{
          flex: 10,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "green",
        }}
      />

      <View
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingVertical: 0,
          // backgroundColor: "orange",
        }}
      >
        <PickChampionButton />
        <PickPositionButton />
      </View>
      <View
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          // backgroundColor: "purple",
        }}
      >
        <LobbySearchButton />
        <FilterButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
