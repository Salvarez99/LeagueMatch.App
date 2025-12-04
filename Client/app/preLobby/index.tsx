import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import RiotLinkModal from "@/components/common/RiotLinkModal";
import GameModeCarousel from "@/components/preLobby/GameModeCarousel";
import LobbySearchButton from "@/components/preLobby/LobbySearchButton";
import PickChampionButton from "@/components/preLobby/PickChampionButton";
import PickPositionDropdown from "@/components/preLobby/PickPositionDropdown";
import RankFilterDropdown from "@/components/preLobby/RankFilterDropdown";
import { styles } from "@/styles/preLobbyStyle";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom hooks
import { usePreLobbyActions } from "../../hooks/usePreLobbyActions";
import { usePreLobbyParams } from "../../hooks/usePreLobbyParams";

export default function PreLobby() {
  const { mode, hasRiotLinked, appUser } = usePreLobbyParams();

  const [gameMap, setGameMap] = useState<string>("Summoner's Rift");
  const [gameMode, setGameMode] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [championId, setChampionId] = useState<string>("");
  const [rankFilter, setRankFilter] = useState<string[]>([]);
  const [riotModalOpen, setRiotModalOpen] = useState<boolean>(false);
  const currentUid = appUser.id;
  const title = mode.charAt(0).toUpperCase() + mode.slice(1);

  const { handleSubmit } = usePreLobbyActions({
    currentUid,
    mode,
    gameMap,
    gameMode,
    position,
    championId,
    rankFilter,
    hasRiotLinked,
    setRiotModalOpen,
  });

  return (
    <>
      <Stack.Screen options={{ title }} />
      <SafeAreaView style={styles.containerStyle} edges={["bottom"]}>
        <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

        <HostCard
          host={{
            uid: currentUid,
            riotId: appUser?.riotId,
            championId: championId,
            position: position,
            ready: false, // <-- REQUIRED to satisfy ILobbyPlayer
          }}
          isLobby={false}
        />

        <GameModeCarousel setGameMap={setGameMap} setGameMode={setGameMode} />

        <View style={styles.champPosContainerStyle}>
          <PickChampionButton
            setChampionId={setChampionId}
            gameMap={gameMap}
          />
          <PickPositionDropdown
            items={["Top", "Jungle", "Middle", "Adc", "Support"]}
            value={position}
            onSelect={setPosition}
            gameMap={gameMap}
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
        {!hasRiotLinked && riotModalOpen && (
          <RiotLinkModal
            visible={riotModalOpen}
            onClose={() => setRiotModalOpen(false)}
          />
        )}
      </SafeAreaView>
    </>
  );
}
