import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbySearchButtonStyle";

// type LobbyMode = "host" | "join";

interface LobbySearchButtonProps {
  mode: string;
  handleCreateLobby: () => void | Promise<void>;
}

export default function LobbySearchButton({
  mode,
  handleCreateLobby,
}: LobbySearchButtonProps) {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCreateLobby()}
      >
        <Text style={styles.text}>{mode === "host" ? "Create Lobby" : "Join"}</Text>
      </TouchableOpacity>
    </View>
  );
}
