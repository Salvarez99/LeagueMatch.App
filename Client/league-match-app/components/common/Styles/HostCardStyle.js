import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hostCardButtonStyle: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.12,
    width: Screen.width * 0.94,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
