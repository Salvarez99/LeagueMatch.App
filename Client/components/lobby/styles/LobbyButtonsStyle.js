import { surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 70,
    elevation: 5,
    backgroundColor: surfaceColor,
  },
  bottomButtonText: {
    color: textColor,

    fontWeight: "bold",
    fontSize: 16,
  },
  defaultTextStyle: {
    fontSize: 14,
    color: textColor,
  },
});
