// PlayerCards.tsx
import * as Clipboard from "expo-clipboard";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles/PlayerCardStyle";

export default function PlayerCards({ style, players = [], maxPlayers }) {

  const actualMaxPlayers = (maxPlayers ?? 5) - 1;
  const hostRender = true;

  // Create empty slots for remaining players
  const slots = Array.from({ length: actualMaxPlayers });

  const PlayerCard = ({ player, isEmpty }) => {
    let borderColor = "#ccc"; // default gray for empty
    let borderWidth = 2;
    let borderStyle = isEmpty ? "dashed" : "solid";

    if (!isEmpty) {
      borderColor = player.ready ? "#00C851" : "#ff4444"; // green / red
    }

    return (
      <TouchableOpacity
        style={[
          styles.playerCard,
          {
            borderWidth,
            borderColor,
            borderStyle,
            opacity: isEmpty ? 0.5 : 1,
          },
        ]}
        disabled={isEmpty}
        onLongPress={async () => {
          await Clipboard.setStringAsync(player.riotId);
          Toast.show({
            type: "success",
            text1: "Copied Riot ID to clipboard: ",
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
            <Text style={styles.defaultTextStyle}>Role: {player.position}</Text>
            <Text style={styles.defaultTextStyle}>
              Champion: {player.championId}
            </Text>
          </>
        )}
      </TouchableOpacity>
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
