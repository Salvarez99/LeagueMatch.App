import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#2a2a2a",
              },
              headerTitleStyle: {
                color: "#b5b5b5ff",
              },
              headerTintColor: "#b5b5b5ff",
            }}
          />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
