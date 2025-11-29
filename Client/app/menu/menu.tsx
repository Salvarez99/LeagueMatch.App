import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import { styles } from "@/styles/menuStyle";

export default function Index() {
  return (
    <SafeAreaView
      style={[styles.safeAreaStyle]}
      edges={["left", "right", "bottom"]}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/preLobby",
            params: {
              mode: "host",
            },
          })
        }
        style={styles.buttonStyle}
      >
        <Text>PreLobby</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/preLobby",
            params: {
              mode: "join",
            },
          })
        }
        style={styles.buttonStyle}
      >
        <Text>Search for Lobby</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
