import { surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerStyle: {
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  hostCardButtonStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: surfaceColor,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 14,
    color: textColor,
  },
});
