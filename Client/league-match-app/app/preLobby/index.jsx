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
  const uid = user?.uid;

  const [gameMap, setGameMap] = useState("Summoner's Rift");
  const [gameMode, setGameMode] = useState("");
  const [position, setPosition] = useState("");
  const [championId, setChampionId] = useState("");
  const [rankFilter, setRankFilter] = useState([]);

  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const hasRiotId = !!appUser?.riotId;

  const [riotModalOpen, setRiotModalOpen] = useState(false);

  // --------------------------
  // DEBUG MOUNT
  // --------------------------
  useEffect(() => {
    LOG.debug("🟦 PreLobby Mounted - Debug State Dump", {
      uid,
      mode,
      gameMap,
      gameMode,
      position,
      championId,
      rankFilter,
      hasRiotId,
      riotId: appUser?.riotId,
    });
  }, []);

  // ==========================================================
  // HOST / JOIN SUBMIT HANDLER
  // ==========================================================
  const handleSubmit = async () => {
    LOG.debug("🔵 handleSubmit()", { mode, hasRiotId });

    if (!hasRiotId) {
      LOG.debug("🛑 No Riot ID — opening Riot modal");
      setRiotModalOpen(true);
      return;
    }

    if (mode === "host") return handleCreateLobby();
    if (mode === "join") return handleJoinLobby();
  };

  // ==========================================================
  // CREATE LOBBY
  // ==========================================================
  const handleCreateLobby = async () => {
    LOG.debug("🟧 HANDLE CREATE LOBBY", {
      uid,
      payload: {
        hostId: uid,
        hostPosition: position,
        gameMap,
        gameMode,
        championId,
        rankFilter,
      },
    });

    try {
      const res = await lobbyApi.createLobby({
        hostId: uid,
        hostPosition: position,
        gameMap,
        gameMode,
        championId,
        rankFilter,
      });

      LOG.debug("🟩 CREATE LOBBY SUCCESS", {
        response: res.data,
      });

      const id = res.data.id;

      LOG.debug("➡️ NAVIGATING TO /lobby/[id]", {
        id,
        gameMap,
        gameMode,
      });

      router.push({
        pathname: `/lobby/${id}`,
        params: { gameMap, gameMode },
      });
    } catch (err) {
      LOG.error("❌ CREATE LOBBY ERROR", {
        status: err.response?.status,
        data: err.response?.data,
      });

      if (
        err.response?.data?.error ===
        "Host must link Riot ID before creating a lobby"
      ) {
        LOG.debug("⚠️ Host missing Riot ID — opening Riot modal");
        setRiotModalOpen(true);
      }
    }
  };

  // ==========================================================
  // JOIN LOBBY
  // ==========================================================
  const handleJoinLobby = async () => {
    LOG.debug("🟪 HANDLE JOIN LOBBY START", {
      uid,
      gameMap,
      gameMode,
      position,
      championId,
      rankFilter,
    });

    try {
      LOG.debug("🔍 Searching for lobby with:", {
        gameMap,
        gameMode,
        desiredPosition: position,
        ranks: rankFilter,
      });

      const findRes = await lobbyApi.findLobby(uid, {
        gameMap,
        gameMode,
        desiredPosition: position,
        ranks: rankFilter,
      });

      LOG.debug("🟩 FIND LOBBY SUCCESS:", findRes.data);

      const lobbyId = findRes.data.id;

      LOG.debug("➡️ Attempting JOIN with payload:", {
        uid,
        position,
        championId,
        lobbyId,
      });

      const joinRes = await lobbyApi.joinLobby(lobbyId, {
        uid,
        position,
        championId,
      });

      LOG.debug("🟩 JOIN SUCCESS:", {
        returnedLobby: joinRes.data?.updatedLobby,
      });

      LOG.debug("➡️ NAVIGATE TO LOBBY WITH justJoined=true", {
        lobbyId,
      });

      router.push({
        pathname: `/lobby/${lobbyId}`,
        params: {
          gameMap,
          gameMode,
          justJoined: "true",
        },
      });
    } catch (err) {
      LOG.error("❌ JOIN FAILED", {
        status: err.response?.status,
        data: err.response?.data,
        error: err,
      });
    }
  };

  // ==========================================================
  // ON LOAD DEBUG
  // ==========================================================
  useEffect(() => {
    LOG.debug("⬆️ PreLobby state updated", {
      uid,
      mode,
      loading,
    });
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
          items={["Top", "Jungle", "Middle", "Adc", "Support"]}
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
