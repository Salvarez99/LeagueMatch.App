import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function HostLobby() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Host Lobby Screen</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}
