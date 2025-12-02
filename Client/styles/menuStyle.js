import { screenColor, surfaceColor, textColor } from "@/utils/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeAreaStyle: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: screenColor,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: surfaceColor,
    borderRadius: 15,
    width: width * 0.9,
    height: height * 0.4,
    marginVertical: height * 0.01,
    elevation: 5,
  },
  text:{
    color: textColor
  }
});
