import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/DiscordButtonStyle";

export default function DiscordButton({ style }) {
  return (
    <View style={[styles.discordContainer, style]}>
      <TouchableOpacity style={styles.discordButton}>
        <Text style={styles.defaultTextStyle}>Discord</Text>
      </TouchableOpacity>
    </View>
  );
}
