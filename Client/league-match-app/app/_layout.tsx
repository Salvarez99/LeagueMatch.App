import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="PreLobby" />
        <Stack.Screen name="Lobby"/>
      </Stack>
    </SafeAreaProvider>
  );
}
