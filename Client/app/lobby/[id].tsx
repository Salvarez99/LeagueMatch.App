import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import DiscordButton from "@/components/lobby/DiscordButton";
import LobbyButtons from "@/components/lobby/LobbyButtons";
import PlayerCards from "@/components/lobby/PlayerCards";
import { styles } from "@/styles/lobbyStyle";

// Custom hooks
import { useLobbyActions } from "@/hooks/useLobbyActions";
import { useLobbyListener } from "@/hooks/useLobbyListener";
import { useLobbyParams } from "@/hooks/useLobbyParams";
import { View, Text } from "react-native";
import { ILobbyPlayer } from "@leaguematch/shared";

export default function Lobby() {
  // 1. Page params (id, uid, gameMap, gameMode)
  const { id, uid, gameMap, gameMode } = useLobbyParams();

  // 2. Firestore listener (real-time lobby updates)
  if (!id || !uid || !gameMap || !gameMode)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  const { lobby } = useLobbyListener(id, uid);
  if (!lobby)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  const host: ILobbyPlayer = lobby!.players![0];
  const players = lobby?.players;

  // 3. All backend actions (leave, kick, ready, discord)
  const {
    onLeave,
    onReady,
    onKickPlayer,
    updateDiscordLink,
    handleUpdateChampion,
  } = useLobbyActions(id, uid);

  return (
    <SafeAreaView
      style={styles.containerStyle}
      edges={["left", "right", "bottom"]}
    >
      <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

      {/* HOST CARD */}
      <HostCard
        style={styles.hostCardContainerStyle}
        host={host}
        isLobby={true}
        status={host?.ready}
        onChampionSelect={handleUpdateChampion}
        currentUid={uid}
      />

      {/* OTHER PLAYERS */}
      <PlayerCards
        style={styles.playerCardsContainerStyle}
        players={players?.slice(1) || []}
        maxPlayers={lobby!.maxPlayers}
        isHost={lobby?.hostId === uid}
        onKick={onKickPlayer}
        onUpdateChampion={handleUpdateChampion}
      />

      {/* DISCORD BUTTON */}
      <DiscordButton
        style={styles.discordButtonContainerStyle}
        isHost={lobby?.hostId === uid}
        discordLink={lobby?.discordLink}
        onUpdateLink={updateDiscordLink}
      />

      {/* READY & LEAVE BUTTONS */}
      <LobbyButtons
        style={styles.lobbyButtonsContainerStyle}
        onLeave={onLeave}
        onReady={onReady}
        status={players?.find((p) => p.uid === uid)?.ready}
      />
    </SafeAreaView>
  );
}
