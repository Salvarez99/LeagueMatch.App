import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import RiotLinkModal from "@/components/common/RiotLinkModal";
import GameModeCarousel from "@/components/preLobby/GameModeCarousel";
import LobbySearchButton from "@/components/preLobby/LobbySearchButton";
import PickChampionButton from "@/components/preLobby/PickChampionButton";
import PickPositionDropdown from "@/components/preLobby/PickPositionDropdown";
import RankFilterDropdown from "@/components/preLobby/RankFilterDropdown";
import { styles } from "@/styles/preLobbyStyle";

// Custom hooks
import { usePreLobbyActions } from "../../hooks/usePreLobbyActions";
import { usePreLobbyParams } from "../../hooks/usePreLobbyParams";

export default function PreLobby() {
  const { uid, mode, hasRiotId, appUser } = usePreLobbyParams();

  const [gameMap, setGameMap] = useState<string>("Summoner's Rift");
  const [gameMode, setGameMode] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [championId, setChampionId] = useState<string>("");
  const [rankFilter, setRankFilter] = useState<string[]>([]);
  const [riotModalOpen, setRiotModalOpen] = useState<boolean>(false);

  if (!uid || !mode) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { handleSubmit } = usePreLobbyActions({
    uid,
    mode,
    gameMap,
    gameMode,
    position,
    championId,
    rankFilter,
    hasRiotId,
    setRiotModalOpen,
  });

  return (
    <SafeAreaView style={styles.containerStyle} edges={["bottom"]}>
      <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

      <HostCard
        host={{
          uid: uid ?? "",
          riotId: appUser?.riotId ?? "",
          championId: championId ?? null,
          position: position ?? null,
          ready: false, // <-- REQUIRED to satisfy ILobbyPlayer
        }}
        isLobby={false}
      />

      <GameModeCarousel setGameMap={setGameMap} setGameMode={setGameMode} />

      <View style={styles.champPosContainerStyle}>
        <PickChampionButton setChampionId={setChampionId} />
        <PickPositionDropdown
          items={["Top", "Jungle", "Middle", "Adc", "Support"]}
          value={position}
          onSelect={setPosition}
        />
      </View>

      <View style={styles.lobbyFilterContainerStyle}>
        <View style={{ flex: 1 }}>
          <LobbySearchButton mode={mode} handleCreateLobby={handleSubmit} />
        </View>

        <View style={{ width: 55 }}>
          <RankFilterDropdown value={rankFilter} onSelect={setRankFilter} />
        </View>
      </View>

      {/* MODAL */}
      {!hasRiotId && riotModalOpen && (
        <RiotLinkModal
          visible={riotModalOpen}
          onClose={() => setRiotModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}
