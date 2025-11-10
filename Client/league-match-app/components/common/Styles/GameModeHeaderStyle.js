import { StyleSheet } from "react-native";

import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  conatinerStyle: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
  },
  gameDetailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
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
    height: Screen.height * 0.05,
    width: Screen.height * 0.05,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
