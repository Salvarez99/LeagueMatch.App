import { styles } from "@/styles/menuStyle";
import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const title = "Menu";
  return (
    <>
      <Stack.Screen
        options={{
          title,
        }}
      />
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
          <Text style={styles.text}>PreLobby</Text>
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
          <Text style={styles.text}>Search for Lobby</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
