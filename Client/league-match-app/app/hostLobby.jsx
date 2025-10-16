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
        // backgroundColor: "brown",
      }}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader
        style={{
          flex: 1.3,
          padding: 8,
          paddingBottom:0,
          // backgroundColor: "red",

        }}
      />

      <HostCard
        style={{
          flex: 3,
          // backgroundColor: "green",
        }}
      />

      <GameModeCarousel
        style={{
          flex: 10,
          padding: 8,
          paddingHorizontal: 0,
          // backgroundColor: "purple",
        }}
        itemStyle={{
          height: Screen.height * 0.46,
        }}
      />

      <View
        style={{
          flex: 2,
          flexDirection: "row",
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
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          paddingVertical: 0,
          // backgroundColor: "blue",
        }}
      >
        <LobbySearchButton style={{padding: 5}}/>
        <FilterButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
