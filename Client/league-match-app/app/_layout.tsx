import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./../context/authContext";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack />
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
