import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)", // dimmed background
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    width: Screen.width * 0.53,
    maxHeight: Screen.height * 0.34,
    paddingVertical: 5,
    position: "absolute",
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
