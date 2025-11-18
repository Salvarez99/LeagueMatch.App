// PlayerCards.tsx
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/PlayerCardStyle";

export default function PlayerCards({ style, players = [], maxPlayers }) {
  console.log("PlayerCards rendered with players:", players?.length);

  const actualMaxPlayers = (maxPlayers ?? 5) - 1;

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
      >
        {isEmpty ? (
          <Text style={styles.defaultTextStyle}>Empty Slot</Text>
        ) : (
          <>
            <Text style={styles.defaultTextStyle}>UID: {player.uid}</Text>
            <Text style={styles.defaultTextStyle}>Role: {player.position}</Text>
            <Text style={styles.defaultTextStyle}>
              Champion: {player.championId}
            </Text>
            <Text style={styles.defaultTextStyle}>
              Ready: {player.ready ? "True" : "False"}
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
