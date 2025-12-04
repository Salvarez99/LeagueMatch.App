import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
