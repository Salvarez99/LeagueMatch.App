import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import DiscordButton from "@/components/lobby/DiscordButton";
import LobbyButtons from "@/components/lobby/LobbyButtons";
import PlayerCards from "@/components/lobby/PlayerCards";
import GhostModal from "@/components/lobby/GhostModal";
import BottomSheet from "@/components/common/BottomSheet";
import { styles } from "@/styles/lobbyStyle";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

// Custom hooks
import { useLobbyActions } from "@/hooks/useLobbyActions";
import { useLobbyListener } from "@/hooks/useLobbyListener";
import { useLobbyParams } from "@/hooks/useLobbyParams";
import { ILobbyPlayer } from "@leaguematch/shared";
import { Text, View } from "react-native";
import { useAuth } from "@/context/authContext";
import { addGhost, updateGhost } from "@/types/ILobbyApiRequest";

import { useState } from "react";

export default function Lobby() {
  const { appUser } = useAuth();
  const { lobbyId, currentUid, gameMap, gameMode } = useLobbyParams();
  const title = `Lobby`;

  const [ghostSlotIndex, setGhostSlotIndex] = useState<number | null>(null);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [ghostModalOpen, setGhostModalOpen] = useState<boolean>(false);
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
    setGhostModalOpen(true);
  }

  function handleAddGhost(data: addGhost) {
    // 1. Validate lobby state
    // 2. Apply map logic (SR requires position)
    // 3. Call onAddGhost from useLobbyActions
    onAddGhost(data);
    setGhostModalOpen(false);
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

        <GhostModal
          visible={ghostModalOpen}
          slotIndex={ghostSlotIndex}
          gameMap={gameMap}
          onSubmit={handleAddGhost}
          onClose={() => setGhostModalOpen(false)}
        />

        {/* DISCORD BUTTON */}
        <DiscordButton
          isHost={lobby.hostId === currentUid}
          discordLink={lobby.discordLink}
          onUpdateLink={updateDiscordLink}
        />
        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: "purple",
            borderRadius: 6,
            alignSelf: "center",
            marginTop: 20,
          }}
          onPress={() => setIsBottomSheetOpen(true)}
        >
          <Text>Open Bottom Sheet</Text>
        </TouchableOpacity>

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
              <>
                {/* <TouchableOpacity onPress={() => setSelected("friends")}>
                  <Text style={{ color: "white", padding: 10 }}>
                    Invite Friend
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelected("recent")}>
                  <Text style={{ color: "white", padding: 10 }}>
                    Recent Players
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelected("ghost")}>
                  <Text style={{ color: "white", padding: 10 }}>
                    Add Ghost Player
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => setSelected("text")}>
                  <Text style={{ color: "white", padding: 10 }}>
                    Go to text
                  </Text>
                </TouchableOpacity>
              </>
            ),
            text: () => {
              return (
                <View>
                  <Text>Hello</Text>
                </View>
              );
            },
            // friends: () => <FriendList />,
            // recent: () => <RecentPlayers />,
            // ghost: () => <GhostForm />,
          }}
        />
      </SafeAreaView>
    </>
  );
}
