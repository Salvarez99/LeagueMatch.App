import { ILobbyPlayer } from "@leaguematch/shared";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/authContext";
import { champions } from "../../utils/constants";
import PickChampionModal from "../preLobby/PickChampionModal";
import { styles } from "./styles/PlayerCardStyle";

interface PlayerCardProps {
  isHost: boolean;
  player: ILobbyPlayer | null;
  isEmpty: boolean;
  slotIndex: number; // NEW: tells which slot this is
  setSelectedPlayerUid: (uid: string | null) => void;
  selectedPlayerUid: string | null;
  onKick: (uid: string) => void;
  onChampionSelect: (uid: string, championId: string) => void;
  onAddGhost: (slotIndex: number) => void; // UPDATED SIGNATURE
}

export default function PlayerCard({
  isHost,
  player,
  isEmpty,
  slotIndex,
  setSelectedPlayerUid,
  selectedPlayerUid,
  onKick,
  onChampionSelect,
  onAddGhost,
}: PlayerCardProps) {
  const { appUser } = useAuth();
  let borderColor: string = "#4e4e4e05";
  let borderWidth: number = 2;
  let borderStyle: "solid" | "dotted" | "dashed" = "solid";

  const isPlayerCurrentUser: boolean = player?.uid === appUser?.id;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [championId, setChampionId] = useState<string>(
    player?.championId ?? ""
  );
  const [championName, setChampionName] = useState<string>(
    champions[championId]
  );

  if (!isEmpty) {
    borderColor = player?.ready ? "#00C851" : "#ff4444";
  }

  const isSelected = selectedPlayerUid === player?.uid;

  return (
    <View style={styles.playerCardWrapper}>
      {/* If slot empty → show plus button */}
      {isEmpty ? (
        <TouchableOpacity
          style={[styles.playerCard, styles.emptySlot]}
          onPress={() => {
            console.log(slotIndex);
            if (isHost) onAddGhost(slotIndex);
          }}
        >
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.emptyText}>Add Ghost</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Normal Filled Slot */}
          <TouchableOpacity
            style={[
              styles.playerCard,
              {
                borderWidth,
                borderColor,
                borderStyle,
              },
              isHost && isSelected && styles.playerCardSelected,
            ]}
            onPress={() => {
              // Host selecting for kick
              if (isHost) {
                setSelectedPlayerUid(
                  selectedPlayerUid === player!.uid ? null : player!.uid
                );
                return;
              }

              // Player opening champ picker
              if (isPlayerCurrentUser) {
                setIsOpen(true);
              }
            }}
            onLongPress={async () => {
              if (!player?.riotId) return;
              await Clipboard.setStringAsync(player!.riotId);
              Toast.show({
                type: "success",
                text1: "Copied Riot ID",
                text2: player?.riotId,
                position: "top",
                topOffset: 55,
              });
            }}
          >
            {player?.isGhost ? (
              <>
                <Image
                  source={require("@/assets/images/ghost.png")}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "contain",
                    alignSelf: "center",
                    marginVertical: 8,
                  }}
                />
                <Text style={styles.defaultTextStyle}>
                  Role: {player?.position}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.defaultTextStyle}>
                  Player Name: {player?.riotId ?? player?.username}
                </Text>
                <Text style={styles.defaultTextStyle}>
                  Role: {player?.position}
                </Text>
                <Text style={styles.defaultTextStyle}>
                  Champion: {player?.championId}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Kick button for host */}
          {isHost && isSelected && (
            <TouchableOpacity
              style={styles.kickButton}
              onPress={() => {
                onKick(player!.uid);
                setSelectedPlayerUid(null);
              }}
            >
              <Text style={styles.kickButtonText}>Kick Player</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Champion Picker Modal */}
      {!isHost && isPlayerCurrentUser && !isEmpty && isOpen && (
        <PickChampionModal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          setChampionId={(id: string) => {
            setChampionId(id);
            onChampionSelect(player!.uid, id);
          }}
          setChampionName={setChampionName}
        />
      )}
    </View>
  );
}
