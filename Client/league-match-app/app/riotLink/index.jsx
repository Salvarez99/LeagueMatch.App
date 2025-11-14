import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const handleLinkLater = () => {
    router.push("/menu/menu");
  };

  const handleLink = () => {
    router.push("/menu/menu");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Link your Riot ID</Text>

      <View style={styles.combinedInputContainer}>
        <View style={styles.inputGroupID}>
          <Text style={styles.label}>Riot ID</Text>
          <TextInput
            placeholder="Riot ID"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroupTag}>
          <Text style={styles.label}>Tagline</Text>
          <TextInput
            placeholder="#000"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.laterButton} onPress={handleLinkLater}>
          <Text>Link later</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.riotButton} onPress={handleLink}>
          <Text>Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
    alignItems: "center",
    backgroundColor: "#111",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },

  combinedInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#1a1a1a",
    height: 70,
    marginBottom: 20,
  },

  inputGroupID: {
    flex: 2,
  },
  inputGroupTag: {
    flex: 1,
  },

  label: {
    color: "#ccc",
    fontSize: 10,
    marginBottom: 4,
  },

  input: {
    color: "white",
    paddingVertical: 6,
    fontSize: 16,
  },

  buttonContainer: { flexDirection: "row", gap: 10 },
  laterButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    width: 172,
    height: 48,
  },
  riotButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e80000ff",
    borderRadius: 12,
    width: 172,
    height: 48,
  },
});
