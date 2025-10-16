import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Screen from "../utils/dimensions";

export default function LobbySearchButton() {

  return (
    <View>
      {/* Main Filter Button */}
      <TouchableOpacity
        style={styles.container}
      >
        <Text style={styles.text}>
          Create Lobby
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.width * 0.8,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
