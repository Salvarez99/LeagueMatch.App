import GameModeHeader from "@/components/common/GameModeHeader";
import HostCard from "@/components/common/HostCard";
import DiscordButton from "@/components/lobby/DiscordButton";
import LobbyButtons from "@/components/lobby/LobbyButtons";
import PlayerCards from "@/components/lobby/PlayerCards";
import GhostSheet from "@/components/lobby/GhostSheet";
// import BottomSheet from "@/components/common/BottomSheet";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import SheetOptionButton from "@/components/common/SheetOptionButton";
import FriendsList from "@/components/common/FriendsList";
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

import { useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Friend {
  username: string;
  availability: "Online" | "Away" | "Offline";
  statusMessage: string;
}

export const dummyFriends: Friend[] = [
  {
    username: "Torgal",
    availability: "Online",
    statusMessage: "Bark! 🐺",
  },
  {
    username: "Clive",
    availability: "Away",
    statusMessage: "On a hunt...",
  },
  {
    username: "Jill",
    availability: "Offline",
    statusMessage: "Gone with the wind ❄️",
  },
  {
    username: "MidDiff",
    availability: "Online",
    statusMessage: "Down to queue 🧠💥",
  },
  // {
  //   username: "JungleKing",
  //   availability: "Online",
  //   statusMessage: "Ganking all lanes 🌿",
  // },
  // {
  //   username: "AFKADC",
  //   availability: "Away",
  //   statusMessage: "Be right back!",
  // },
  // {
  //   username: "SupportiveSoul",
  //   availability: "Offline",
  //   statusMessage: "Healing IRL 💖",
  // },
  // {
  //   username: "RiftRunner",
  //   availability: "Online",
  //   statusMessage: "Let's climb together!",
  // },
  // {
  //   username: "SneakyFox",
  //   availability: "Away",
  //   statusMessage: "Lurking in the shadows...",
  // },
  // {
  //   username: "LagMaster",
  //   availability: "Offline",
  //   statusMessage: "Disconnected again 📴",
  // },
];

export default function Lobby() {
  const { appUser } = useAuth();
  const { lobbyId, currentUid, gameMap, gameMode } = useLobbyParams();
  const title = `Lobby`;

  const [ghostSlotIndex, setGhostSlotIndex] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheetIndex, setSheetIndex] = useState<-1 | 0>(-1);
  const [selected, setSelected] = useState<"base" | "friends" | "ghost">(
    "base"
  );
  const snapPoints = useMemo(() => ["45%"], []);

  const { lobby } = useLobbyListener(lobbyId, currentUid);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
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
    setGhostSlotIndex(slotIndex);
    setSelected("base");
    openSheet();
  }

  function handleAddGhost(data: addGhost) {
    // 1. Validate lobby state
    // 2. Apply map logic (SR requires position)
    // 3. Call onAddGhost from useLobbyActions
    onAddGhost(data);
    setSelected("base");
    // close the sheet imperatively
    bottomSheetRef.current?.close();
    setSheetIndex(-1);
  }

  const handleUpdateGhost = (data: updateGhost) => {
    if (!canAddGhost) return console.log("Cannot update ghost right now");
    onUpdateGhost(data);
  };

  function openSheet() {
    setSheetIndex(0);
    requestAnimationFrame(() => {
      bottomSheetRef.current?.expand();
    });
  }

  function renderSheetContent() {
    switch (selected) {
      case "friends":
        return <FriendsList data={dummyFriends} />;

      case "ghost":
        return (
          <GhostSheet
            gameMap={gameMap}
            slotIndex={ghostSlotIndex}
            onSubmit={handleAddGhost}
            onBack={() => {
              setSelected("base");
            }}
          />
        );

      case "base":
      default:
        return (
          <View style={{ padding: 16 }}>
            <SheetOptionButton
              title="Invite Friend"
              subtitle="Choose from your friends list"
              icon={<Ionicons name="people" size={24} color="white" />}
              onPress={() => setSelected("friends")}
            />

            <SheetOptionButton
              title="Add Ghost Player"
              subtitle="Create a placeholder player"
              icon={
                <Image
                  source={require("@/assets/images/ghost.png")}
                  style={{ width: 25, height: 25 }}
                />
              }
              onPress={() => {
                if (gameMap === "Summoner's Rift") {
                  setSelected("ghost");
                } else {
                  if (ghostSlotIndex !== null) {
                    handleAddGhost({
                      ghostId: "Test Ghost",
                      index: ghostSlotIndex + 1,
                      gameMap,
                    });
                    setSheetIndex(-1);
                  }
                }
              }}
            />
          </View>
        );
    }
  }

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
          backdropComponent={renderBackdrop}
          ref={bottomSheetRef}
          index={sheetIndex}
          snapPoints={snapPoints}
          enablePanDownToClose
          keyboardBehavior="fillParent"
          onChange={(index) => {
            if (index === -1) {
              setSelected("base");
            }
          }}
          style={styles1.container}
          backgroundStyle={{ backgroundColor: "#1f1f1f" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
        >
          <BottomSheetView style={styles1.contentContainer}>
            {renderSheetContent()}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </>
  );
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#1f1f1f",
  },
});
