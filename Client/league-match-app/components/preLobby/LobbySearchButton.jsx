import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../utils/dimensions";

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.width * 0.8,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
