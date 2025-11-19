// PlayerCards.tsx
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles/PlayerCardStyle";

export default function PlayerCards({
  style,
  players = [],
  maxPlayers,
  isHost = false,
  onKick,
}) {
  const actualMaxPlayers = (maxPlayers ?? 5) - 1;
  const hostRender = true;
  const [selectedPlayerUid, setSelectedPlayerUid] = useState(null);

  // Create empty slots for remaining players
  const slots = Array.from({ length: actualMaxPlayers });

  const PlayerCard = ({ player, isEmpty }) => {
    let borderColor = "#ccc";
    let borderWidth = 2;
    let borderStyle = isEmpty ? "dashed" : "solid";

    if (!isEmpty) {
      borderColor = player.ready ? "#00C851" : "#ff4444";
    }

    const isSelected = selectedPlayerUid === player?.uid;

    return (
      <View style={styles.playerCardWrapper}>
        <TouchableOpacity
          style={[
            styles.playerCard,
            {
              borderWidth,
              borderColor,
              borderStyle,
              opacity: isEmpty ? 0.5 : 1,
            },
            isSelected && styles.playerCardSelected, // shrink if selected
          ]}
          disabled={isEmpty}
          onPress={() => {
            if (!isHost || isEmpty) return;
            setSelectedPlayerUid(
              selectedPlayerUid === player.uid ? null : player.uid
            );
          }}
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
          {isEmpty ? (
            <Text style={styles.defaultTextStyle}>Empty Slot</Text>
          ) : (
            <>
              <Text style={styles.defaultTextStyle}>
                Riot ID: {player.riotId}
              </Text>
              <Text style={styles.defaultTextStyle}>
                Role: {player.position}
              </Text>
              <Text style={styles.defaultTextStyle}>
                Champion: {player.championId}
              </Text>
            </>
          )}
        </TouchableOpacity>

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
      </View>
    );
  };

  return (
    <View style={[styles.playersContainer, style]}>
      {slots.map((_, index) => {
        const player = players[index];
        return <PlayerCard key={index} player={player} isEmpty={!player} />;
      })}
    </View>
  );
}
