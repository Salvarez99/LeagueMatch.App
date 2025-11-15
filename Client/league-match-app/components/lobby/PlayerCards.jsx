// PlayerCards.tsx
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/PlayerCardStyle";

export default function PlayerCards({ style, players = [], maxPlayers }) {
  console.log("PlayerCards rendered with players:", players?.length);
  const actualMaxPlayers = maxPlayers - 1 ?? 4;

  // Create an array with maxPlayers length (e.g., 5 slots)
  const slots = Array.from({ length: actualMaxPlayers });

  const PlayerCard = ({ player, isEmpty }) => (
    <TouchableOpacity
      style={[
        styles.playerCard,
        isEmpty && { opacity: 0.5, borderStyle: "dashed" },
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
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.playersContainer, style]}>
      {slots.map((_, index) => {
        const player = players[index];
        return <PlayerCard key={index} player={player} isEmpty={!player} />;
      })}
    </View>
  );
}
