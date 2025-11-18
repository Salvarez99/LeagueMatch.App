import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import RiotLinkModal from "../../components/common/RiotLinkModal";
import GameModeCarousel from "../../components/preLobby/GameModeCarousel";
import LobbySearchButton from "../../components/preLobby/LobbySearchButton";
import PickChampionButton from "../../components/preLobby/PickChampionButton";
import PickPositionDropdown from "../../components/preLobby/PickPositionDropdown";
import RankFilterDropdown from "../../components/preLobby/RankFilterDropdown";
import { useAuth } from "./../../context/authContext";
import { styles } from "./../../styles/preLobbyStyle";
import { lobbyApi } from "./../../utils/api/lobbyApi";
import { LOG } from "./../../utils/logger";

export default function PreLobby() {
  const { user, loading, appUser } = useAuth();
  const [gameMap, setGameMap] = useState("Summoner's Rift");
  const [gameMode, setGameMode] = useState("");
  const [position, setPosition] = useState("");
  const [championId, setChampionId] = useState("");
  const [rankFilter, setRankFilter] = useState([]);
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const hasRiotId = !!appUser?.riotId;
  const [riotModalOpen, setRiotModalOpen] = useState(false);

  const uid = user?.uid;

  const handleSubmit = async () => {
    if (!hasRiotId) {
      setRiotModalOpen(true);
      return;
    }

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

      LOG.debug(`ATTEMPTING TO CREATE LOBBY WITH FOLLOWING DETAILS:`);
      LOG.debug(`hostId: ${hostId}`);
      LOG.debug(`gameMap: ${gameMap}`);
      LOG.debug(`gameMode: ${gameMode}`);
      LOG.debug(`position: ${position}`);
      LOG.debug(`championId: ${championId}`);
      LOG.debug(`rankFilter: ${rankFilter}`);

      const id = res.data.id;

      router.push({
        pathname: `/lobby/${id}`,
        params: {
          gameMap,
          gameMode,
        },
      });

      LOG.debug(`LOBBY CREATED SUCCESSFULLY. ID: ${id}`);
    } catch (err) {
      if (
        err.response?.data?.error ===
        "Host must link Riot ID before creating a lobby"
      ) {
        LOG.debug("Host must link Riot ID before creating a lobby");
        LOG.debug(`${err.response?.data?.error}`);
        setRiotModalOpen(true);
        return;
      }

      LOG.error(err);
    }
  };

  const handleJoinLobby = async () => {
    LOG.debug(`uid:${uid}`);
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
      LOG.error("Error finding lobby:", {
        data: err.response.data,
      });
    }
  };

  useEffect(() => {
    LOG.debug(`Mode: ${mode}`);
    LOG.debug(`User: ${user.uid}`);

    LOG.debug("Loading:", loading);
  }, [user, loading]);

  return (
    <SafeAreaView style={styles.containerStyle} edges={["bottom"]}>
      <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

      <HostCard
        host={{ uid, riotId: appUser.riotId, championId, position }}
        isLobby={false}
      />

      <GameModeCarousel setGameMap={setGameMap} setGameMode={setGameMode} />

      <View style={styles.champPosContainerStyle}>
        <PickChampionButton setChampionId={setChampionId} />
        <PickPositionDropdown
          items={["Top", "Jungle", "Mid", "Adc", "Support"]}
          value={position}
          onSelect={(p) => setPosition(p)}
        />
      </View>
      <View style={styles.lobbyFilterContainerStyle}>
        <View style={{ flex: 1 }}>
          <LobbySearchButton mode={mode} handleCreateLobby={handleSubmit} />
        </View>

        <View style={{ width: 55 }}>
          <RankFilterDropdown
            value={rankFilter}
            onSelect={(updated) => setRankFilter(updated)}
          />
        </View>
      </View>
      {!hasRiotId && riotModalOpen && (
        <RiotLinkModal
          visible={riotModalOpen}
          onClose={() => setRiotModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}
