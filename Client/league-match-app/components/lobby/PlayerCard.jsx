import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/authContext";
import { champions } from "../../utils/constants";
import PickChampionModal from "../preLobby/PickChampionModal";
import { styles } from "./styles/PlayerCardStyle";

export default function PlayerCard({
  isHost,
  player,
  isEmpty,
  setSelectedPlayerUid,
  selectedPlayerUid,
  onKick,
  onChampionSelect,
}) {
  const { appUser } = useAuth();
  let borderColor = "#ccc";
  let borderWidth = 2;
  let borderStyle = "solid";

  const isPlayerCurrentUser = player?.uid === appUser?.uid;
  const [isOpen, setIsOpen] = useState(false);
  const [championId, setChampionId] = useState(player?.championId);
  const [championName, setChampionName] = useState(champions[championId]);

  if (!isEmpty) {
    borderColor = player.ready ? "#00C851" : "#ff4444";
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
            opacity: isEmpty ? 0.5 : 1,
          },
          isHost && isSelected && styles.playerCardSelected, // shrink if selected
        ]}
        disabled={isEmpty}
        onPress={() => {
          //If slot is empty then do nothing
          if (isEmpty) return;

          //If user is not host and is current player then open champ modal
          if (!isHost && isPlayerCurrentUser) {
            setIsOpen(true);
            return;
          }

          //If user is host then toggle selected player to show kick button
          if (isHost)
            setSelectedPlayerUid(
              selectedPlayerUid === player.uid ? null : player.uid
            );
        }}
        //OnLongPress copy the players riotId to clipBoard and show toast
        onLongPress={async () => {
          if (isEmpty) return;
          await Clipboard.setStringAsync(player.riotId);
          Toast.show({
            type: "success",
            text1: "Copied Riot ID",
            text2: player.riotId,
            position: "center",
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
              Riot ID: {player.riotId}
            </Text>
            <Text style={styles.defaultTextStyle}>Role: {player.position}</Text>
            <Text style={styles.defaultTextStyle}>
              Champion: {player.championId}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/*If player is host and playerCard is not empty then render kick button */}
      {isHost && isSelected && !isEmpty && (
        <TouchableOpacity
          style={styles.kickButton}
          onPress={() => {
            onKick(player.uid);
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
          setChampionId={(id) => {
            setChampionId(id);
            onChampionSelect(player.uid, id); // <-- SEND UPWARD
          }}
          setChampionName={setChampionName}
        />
      )}
    </View>
  );
}
