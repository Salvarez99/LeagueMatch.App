import { SafeAreaView } from "react-native-safe-area-context";
import GameModeHeader from "../../components/common/GameModeHeader";
import HostCard from "../../components/common/HostCard";
import DiscordButton from "../../components/lobby/DiscordButton";
import LobbyButtons from "../../components/lobby/LobbyButtons";
import PlayerCards from "../../components/lobby/PlayerCards";
import { styles } from "../../styles/lobbyStyle";

// Custom hooks
import { useLobbyActions } from "../../hooks/useLobbyActions";
import { useLobbyListener } from "../../hooks/useLobbyListener";
import { useLobbyParams } from "../../hooks/useLobbyParams";

export default function Lobby() {
  // 1. Page params (id, uid, gameMap, gameMode)
  const { id, uid, gameMap, gameMode } = useLobbyParams();

  // 2. Firestore listener (real-time lobby updates)
  const { lobby } = useLobbyListener(id, uid);
  const host = lobby?.players?.[0];
  const players = lobby?.players;

  // 3. All backend actions (leave, kick, ready, discord)
  const { onLeave, onReady, onKickPlayer, updateDiscordLink } = useLobbyActions(
    id,
    uid
  );

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

      {/* HOST CARD */}
      <HostCard
        style={styles.hostCardContainerStyle}
        host={host}
        isLobby={true}
        status={host?.ready}
      />

      {/* OTHER PLAYERS */}
      <PlayerCards
        style={styles.playerCardsContainerStyle}
        players={players?.slice(1) || []}
        maxPlayers={lobby?.maxPlayers}
        isHost={lobby?.hostId === uid}
        onKick={onKickPlayer}
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
