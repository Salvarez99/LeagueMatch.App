import { surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1, // take remaining space in row
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: surfaceColor,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  text:{
    color: textColor,
  }
});
