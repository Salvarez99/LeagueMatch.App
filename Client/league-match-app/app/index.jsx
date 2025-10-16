import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";

const {width, height} = Dimensions.get("window")

export default function Index() {

  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
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
    </View>
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
    marginVertical: 10,
    elevation: 5,
  },
});
