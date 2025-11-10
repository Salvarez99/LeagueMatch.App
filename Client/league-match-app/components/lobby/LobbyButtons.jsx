import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbyButtonsStyle";

export default function LobbyButtons({ style, onLeave }) {
  return (
    <View style={[styles.bottomButtonRow, style]}>
      {/* Ready Button */}
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
      >
        <Text style={styles.defaultTextStyle}>Ready</Text>
      </TouchableOpacity>

      {/* Leave Button */}
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
        onPress={onLeave}
      >
        <Text style={styles.defaultTextStyle}>Leave</Text>
      </TouchableOpacity>
    </View>
  );
}
