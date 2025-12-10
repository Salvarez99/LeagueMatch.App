import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import DiscordButton from "@/components/lobby/DiscordButton";
import LobbyButtons from "@/components/lobby/LobbyButtons";
import PlayerCards from "@/components/lobby/PlayerCards";
import GhostSheet from "@/components/lobby/GhostSheet";
import BottomSheet from "@/components/common/BottomSheet";
import SheetOptionButton from "@/components/common/SheetOptionButton";
import { Image } from "react-native";
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
import { addGhost, updateGhost } from "@/types/ILobbyApiRequest";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Lobby() {
  const { appUser } = useAuth();
  const { lobbyId, currentUid, gameMap, gameMode } = useLobbyParams();
  const title = `Lobby`;

  const [ghostSlotIndex, setGhostSlotIndex] = useState<number | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const { lobby } = useLobbyListener(lobbyId, currentUid);
  if (!lobby)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const canAddGhost = lobby.state === "IDLE" || lobby.state === "FINISHED";
  const host: ILobbyPlayer = lobby.players[0]!;
  const players = lobby.players;
  const currentPlayer = players.find((p) => p && p.uid === currentUid);
  const isHost = host.uid === appUser!.id;

  const {
    onLeave,
    onReady,
    onSearch,
    onKickPlayer,
    updateDiscordLink,
    handleUpdateChampion,
    onAddGhost,
    onUpdateGhost,
  } = useLobbyActions(lobbyId, currentUid);

  function handleRequestAddGhost(slotIndex: number) {
    // if (!slotIndex) return;
    setGhostSlotIndex(slotIndex);
    setIsBottomSheetOpen(true);
  }

  function handleAddGhost(data: addGhost) {
    // 1. Validate lobby state
    // 2. Apply map logic (SR requires position)
    // 3. Call onAddGhost from useLobbyActions
    onAddGhost(data);
    setIsBottomSheetOpen(false);
  }

  const handleUpdateGhost = (data: updateGhost) => {
    if (!canAddGhost) return console.log("Cannot update ghost right now");
    onUpdateGhost(data);
  };

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
          onAddGhost={handleRequestAddGhost}
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

        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          initial="base"
          renders={{
            base: ({ setSelected }) => (
              <View style={{ padding: 16, width: "100%" }}>
                <SheetOptionButton
                  onPress={() => setSelected("friends")}
                  title="Invite Friend"
                  subtitle="Choose from your friends list"
                  icon={<Ionicons name="people" size={24} color="white" />}
                />

                <SheetOptionButton
                  onPress={() => setSelected("recent")}
                  title="Recent Players"
                  subtitle="Pick someone you played with"
                  icon={<Ionicons name="time" size={26} color="white" />}
                />

                <SheetOptionButton
                  onPress={() => setSelected("ghost")}
                  title="Add Ghost Player"
                  subtitle="Create a placeholder profile"
                  icon={
                    <Image
                      source={require("@/assets/images/ghost.png")}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                        alignSelf: "center",
                        marginVertical: 8,
                      }}
                    />
                  }
                />
              </View>
            ),

            // friends: () => <FriendList />,
            // recent: () => <RecentPlayers />,
            ghost: ({ setSelected }) => (
              <GhostSheet
                gameMap={gameMap}
                slotIndex={ghostSlotIndex}
                onSubmit={handleAddGhost}
                onBack={() => setSelected("base")}
                onExit={() => setIsBottomSheetOpen(false)}
              />
            ),
          }}
        />
      </SafeAreaView>
    </>
  );
}
