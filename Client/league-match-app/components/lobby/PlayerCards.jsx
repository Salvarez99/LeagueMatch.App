import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PlayerCards({ style }) {
  const players = [1, 2, 3, 4];

  const PlayerCard = ({ player }) => (
    <TouchableOpacity style={styles.playerCard}>
      <Text style={styles.defaultTextStyle}>{player}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.playersContainer, style]}>
      {players.map((player, index) => (
        <PlayerCard key={index} player={player} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  playersContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  playerCard: {
    backgroundColor: "#D9D9D9",
    width: "45%", // roughly 2 per row
    height: "46%", // perfect square
    justifyContent: "center",
    alignItems: "center",
    margin: "2%",
    borderRadius: 10,
    elevation: 5,
  },
  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
  },
});
