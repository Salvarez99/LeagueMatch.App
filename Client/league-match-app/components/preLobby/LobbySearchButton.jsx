import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbySearchButtonStyle";
export default function LobbySearchButton({ mode, handleCreateLobby }) {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCreateLobby()}
      >
        <Text style={styles.text}>
          {mode === "host" ? "Create Lobby" : "Join"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
