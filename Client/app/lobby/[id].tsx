import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import DiscordButton from "@/components/lobby/DiscordButton";
import LobbyButtons from "@/components/lobby/LobbyButtons";
import PlayerCards from "@/components/lobby/PlayerCards";
import { styles } from "@/styles/lobbyStyle";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Custom hooks
import { useLobbyActions } from "@/hooks/useLobbyActions";
import { useLobbyListener } from "@/hooks/useLobbyListener";
import { useLobbyParams } from "@/hooks/useLobbyParams";
import { ILobbyPlayer } from "@leaguematch/shared";
import { Text, View } from "react-native";
import { useAuth } from "@/context/authContext";

export default function Lobby() {
  const {appUser} = useAuth();
  const { lobbyId, currentUid, gameMap, gameMode } = useLobbyParams();
  const title = `Lobby`;

  const { lobby } = useLobbyListener(lobbyId, currentUid);
  if (!lobby)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const host: ILobbyPlayer = lobby.players[0];
  const players = lobby.players;
  const currentPlayer = players.find((p) => p.uid === currentUid);
  const isHost = host.uid === appUser!.id;



  const {
    onLeave,
    onReady,
    onSearch,
    onKickPlayer,
    updateDiscordLink,
    handleUpdateChampion,
  } = useLobbyActions(lobbyId, currentUid);

  return (
    <>
      <Stack.Screen options={{ title }} />
      <SafeAreaView
        style={styles.containerStyle}
        edges={["left", "right", "bottom"]}
      >
        <GameModeHeader gameMap={gameMap} gameMode={gameMode} />

        {/* HOST CARD */}
        <HostCard
          host={host}
          isLobby={true}
          status={host.ready}
          onChampionSelect={handleUpdateChampion}
          currentUid={currentUid}
        />

        {/* OTHER PLAYERS */}
        <PlayerCards
          style={styles.playerCardsContainerStyle}
          players={players.slice(1) || []}
          maxPlayers={lobby.maxPlayers}
          isHost={lobby.hostId === currentUid}
          onKick={onKickPlayer}
          onUpdateChampion={handleUpdateChampion}
        />

        {/* DISCORD BUTTON */}
        <DiscordButton
          isHost={lobby.hostId === currentUid}
          discordLink={lobby.discordLink}
          onUpdateLink={updateDiscordLink}
        />

        {/* READY & LEAVE BUTTONS */}
        <LobbyButtons
          isHost={isHost}
          lobby={lobby}
          onLeave={onLeave}
          onReady={onReady}
          onSearch={onSearch}
          status={currentPlayer!.ready}
        />
      </SafeAreaView>
    </>
  );
}
