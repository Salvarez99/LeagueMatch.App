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
    paddingVertical: 8,
  },
  discordButton: {
    height: "100%",
    width: "94%",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
