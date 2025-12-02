import { surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultButtonStyle: {
    width: "100%",
    paddingVertical: "9%",
    elevation: 5,

    borderRadius: 10,
    backgroundColor: surfaceColor,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultTextStyle: {
    fontSize: 14,
    color: textColor,
  },
});
