import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  conatinerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    marginBottom: 5,
    height: "8%",
  },
  gameDetailsContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  gameMapStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  gameModeStyle: {
    fontSize: 16,
    color: "#000",
  },
  gameIconStyle: {
    backgroundColor: "#D9D9D9",
    height: 45,
    width: 45,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
