import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import FilterButton from "../../components/preLobby/FilterButton";
import GameModeCarousel from "../../components/preLobby/GameModeCarousel";
import LobbySearchButton from "../../components/preLobby/LobbySearchButton";
import PickChampionButton from "../../components/preLobby/PickChampionButton";
import PickPositionButton from "../../components/preLobby/PickPositionButton";
import { lobbyApi } from "../../utils/api/lobbyApi";
import Screen from "../../utils/dimensions";

export default function PreLobby() {
  const [gameMap, setGameMap] = useState("Summoner's Rift");
  const [gameMode, setGameMode] = useState("");
  const [position, setPosition] = useState("");
  const [championId, setChampionId] = useState("");
  const [rankFilter, setRankFilter] = useState([]);
  const router = useRouter();

  const handleCreateLobby = async () => {
    const hostId = "1";
    try {
      const res = await lobbyApi.createLobby({
        hostId: hostId,
        hostPosition: position,
        gameMap: gameMap,
        gameMode: gameMode,
        championId: championId,
        rankFilter: rankFilter,
      });

      console.log(`ATTEMPTING TO CREATE LOBBY WITH FOLLOWING DETAILS:`);
      console.log(`hostId: ${hostId}`);
      console.log(`gameMap: ${gameMap}`);
      console.log(`gameMode: ${gameMode}`);
      console.log(`position: ${position}`);
      console.log(`championId: ${championId}`);
      console.log(`rankFilter: ${rankFilter}`);

      const id = res.data.id;

      router.push({
        pathname: `/lobby/${id}`,
        params: {
          gameMap,
          gameMode,
        },
      });

      console.log(`LOBBY CREATED SUCCESSFULLY. ID: ${id}`);
    } catch (err) {
      if (err.response) {
        // ✅ Backend responded but returned an error (e.g., 500)
        console.error("Error creating lobby (backend responded):", {
          status: err.response.status,
          data: err.response.data,
        });
      } else if (err.request) {
        // ⚠️ Request was made but no response received
        console.error("Error creating lobby (no response):", err.request);
      } else {
        // ❌ Something else went wrong in setting up the request
        console.error("Error creating lobby (setup):", err.message);
      }
    }
  };

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
        <PickChampionButton setChampionId={setChampionId} />
        <PickPositionButton setPosition={setPosition} />
      </View>
      <View style={styles.lobbyFilterContainerStyle}>
        <LobbySearchButton
          gameMap={gameMap}
          gameMode={gameMode}
          handleCreateLobby={handleCreateLobby}
        />
        <FilterButton setRankFilter={setRankFilter} />
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
