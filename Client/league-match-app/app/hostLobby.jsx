import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FilterButton from "../components/FilterButton";
import Screen from "../utils/dimensions";
import LobbySearchButton from "../components/LobbySearchButton";
import GameModeHeader from "../components/GameModeHeader";
import HostCard from "../components/HostCard";
import GameModeCarousel from "../components/GameModeCarousel";
import PickChampionButton from "../components/PickChampionButton";
import PickPositionButton from "../components/PickPositionButton";

export default function HostLobby() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          flex: 1.2,
          display: "flex",
        }}
      >
        <GameModeHeader />
      </View>
      <View
        style={{
          flex: 3,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "blue",
        }}
      >
        <HostCard />
      </View>
      <View
        style={{
          flex: 10,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "green",
        }}
      >
        <GameModeCarousel />
      </View>
      <View
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          // backgroundColor: "pink",
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.width * 0.6,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
