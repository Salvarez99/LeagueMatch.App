import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import FilterButton from "../../components/preLobby/FilterButton";
import GameModeCarousel from "../../components/preLobby/GameModeCarousel";
import LobbySearchButton from "../../components/preLobby/LobbySearchButton";
import PickChampionButton from "../../components/preLobby/PickChampionButton";
import PickPositionDropdown from "../../components/preLobby/PickPositionDropdown";
import { useAuth } from "./../../context/authContext";
import { styles } from "./../../styles/preLobbyStyle";
import { lobbyApi } from "./../../utils/api/lobbyApi";

export default function PreLobby() {
  const { user, loading } = useAuth();
  const uid = user?.uid;
  const [gameMap, setGameMap] = useState("Summoner's Rift");
  const [gameMode, setGameMode] = useState("");
  const [position, setPosition] = useState("");
  const [championId, setChampionId] = useState("");
  const [rankFilter, setRankFilter] = useState([]);
  const router = useRouter();
  const { mode } = useLocalSearchParams();

  const handleSubmit = async () => {
    switch (mode) {
      case "host":
        handleCreateLobby();
        break;
      case "join":
        handleJoinLobby();
        break;
    }
  };

  const handleCreateLobby = async () => {
    const hostId = uid;
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

  const handleJoinLobby = async () => {
    console.log(`uid:${uid}`);
    try {
      const findRes = await lobbyApi.findLobby({
        gameMap: gameMap,
        gameMode: gameMode,
        desiredPosition: position,
        ranks: rankFilter,
      });

      const lobbyId = findRes.data.id;

      const joinRes = await lobbyApi.joinLobby(lobbyId, {
        uid: uid,
        position: position,
        championId: championId,
      });

      router.push({
        pathname: `/lobby/${lobbyId}`,
        params: {
          gameMap,
          gameMode,
        },
      });
    } catch (err) {
      console.error("Error finding lobby:", {
        data: err.response.data,
      });
    }
  };

  useEffect(() => {
    console.log(`Mode: ${mode}`);
    console.log(`User: ${user.uid}`);

    console.log("Loading:", loading);
  }, [user, loading]);

  return (
    <SafeAreaView style={styles.containerStyle} edges={["bottom"]}>
      <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

      <HostCard host={{ uid, championId, position }} />

      <GameModeCarousel setGameMap={setGameMap} setGameMode={setGameMode} />

      <View style={styles.champPosContainerStyle}>
        <PickChampionButton setChampionId={setChampionId} />
        <PickPositionDropdown
          items={["Top", "Jungle", "Mid", "ADC", "Support"]}
          value={position}
          onSelect={(p) => setPosition(p)}
        />

        {/* <PickPositionButton setPosition={setPosition} /> */}
      </View>
      <View style={styles.lobbyFilterContainerStyle}>
        <LobbySearchButton mode={mode} handleCreateLobby={handleSubmit} />
        <FilterButton setRankFilter={setRankFilter} />
      </View>
    </SafeAreaView>
  );
}
