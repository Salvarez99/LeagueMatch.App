import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/PlayerCardStyle";
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
