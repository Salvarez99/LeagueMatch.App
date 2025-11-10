import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbySearchButtonStyle";
export default function LobbySearchButton({
  style,
  buttonStyle,
  textStyle,
  mode,
  handleCreateLobby,
}) {
  return (
    <View style={[{}, style]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => handleCreateLobby()}
      >
        <Text style={[styles.text, textStyle]}>
          {mode === "host" ? "Create Lobby" : "Join"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
