import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  defaultButtonStyle: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.height * 0.07,
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
