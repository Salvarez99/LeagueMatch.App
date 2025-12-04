import { ILobbyPlayer } from "@leaguematch/shared";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/authContext";
import { champions } from "../../utils/constants";
import PickChampionModal from "../preLobby/PickChampionModal";
import { styles } from "./styles/PlayerCardStyle";

interface PlayerCardProps {
  isHost: boolean;
  player: ILobbyPlayer | null;
  isEmpty: boolean;
  setSelectedPlayerUid: (uid: string | null) => void;
  selectedPlayerUid: string | null;
  onKick: (uid: string) => void;
  onChampionSelect: (uid: string, championId: string) => void;
}

export default function PlayerCard({
  isHost,
  player,
  isEmpty,
  setSelectedPlayerUid,
  selectedPlayerUid,
  onKick,
  onChampionSelect,
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
      {/*Player Card*/}
      <TouchableOpacity
        style={[
          styles.playerCard,
          {
            borderWidth,
            borderColor,
            borderStyle,
            opacity: 1,
          },
          isHost && isSelected && styles.playerCardSelected, // shrink if selected
        ]}
        disabled={isEmpty}
        onPress={() => {
          //If slot is empty then do nothing
          if (isEmpty) return;

          //If authUser is not host and is current player then open champ modal
          if (!isHost && isPlayerCurrentUser) {
            setIsOpen(true);
            return;
          }

          //If authUser is host then toggle selected player to show kick button
          if (isHost)
            setSelectedPlayerUid(
              selectedPlayerUid === player!.uid ? null : player!.uid
            );
        }}
        //OnLongPress copy the players riotId to clipBoard and show toast
        onLongPress={async () => {
          if (isEmpty || !player?.riotId) return;
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
        {/*If the playerSlot is empty then render an empty card */}
        {isEmpty ? (
          <Text style={styles.defaultTextStyle}>Empty Slot</Text>
        ) : (
          <>
            <Text style={styles.defaultTextStyle}>
              Player Name: {player?.riotId ?? appUser!.username}
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

      {/*If player is host and playerCard is not empty then render kick button */}
      {isHost && isSelected && !isEmpty && (
        <TouchableOpacity
          style={styles.kickButton}
          onPress={() => {
            onKick(player?.uid);
            setSelectedPlayerUid(null);
          }}
        >
          <Text style={styles.kickButtonText}>Kick Player</Text>
        </TouchableOpacity>
      )}

      {!isHost && isPlayerCurrentUser && !isEmpty && isOpen && (
        <PickChampionModal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          setChampionId={(id: string) => {
            setChampionId(id);
            onChampionSelect(player!.uid, id); // <-- SEND UPWARD
          }}
          setChampionName={setChampionName}
        />
      )}
    </View>
  );
}
