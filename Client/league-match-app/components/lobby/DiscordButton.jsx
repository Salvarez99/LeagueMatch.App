import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DiscordButton({ style }) {
  return (
    <View style={[styles.discordContainer, style]}>
      <TouchableOpacity style={styles.discordButton}>
        <Text style={styles.defaultTextStyle}>Discord</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  discordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    padding: 8,
    paddingHorizontal: 10,
  },
  discordButton: {
    height: "100%",
    width: "100%",
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 5,
  },
  discordText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
  },
});
