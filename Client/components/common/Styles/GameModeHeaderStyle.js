import { StyleSheet } from "react-native";
import { surfaceColor, textColor } from "@/utils/colors";

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
    color: textColor,
  },
  gameModeStyle: {
    fontSize: 16,
    color: textColor,
  },
  gameIconStyle: {
    backgroundColor: surfaceColor,
    height: 45,
    width: 45,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
