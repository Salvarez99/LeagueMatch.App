import { router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      edges={["left", "right", "bottom"]}
    >
      <TouchableOpacity
        onPress={() => router.push("/HostLobby")}
        style={styles.buttonStyle}
      >
        <Text>Host Lobby</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/SearchLobby")}
        style={styles.buttonStyle}
      >
        <Text>Search for Lobby</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    width: width * 0.9, // 90% of screen width
    height: height * 0.4, // 20% of screen height
    marginVertical: height * 0.01,
    elevation: 5,
  },
});
