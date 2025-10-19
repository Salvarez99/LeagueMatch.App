import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LobbyButtons({ style }) {
  return (
    <View style={[styles.bottomButtonRow, style]}>
      {/* Ready / Leave Buttons */}
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
      >
        <Text style={styles.defaultTextStyle}>Ready</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
      >
        <Text style={styles.defaultTextStyle}>Leave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtonRow: {
    flex: 1.3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 8,
  },
  bottomButton: {
    width: "45%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  bottomButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
  },
});
