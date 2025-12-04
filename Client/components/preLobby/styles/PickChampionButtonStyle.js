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
  disabledButtonStyle: {
    backgroundColor: "#2c2c2c", // darker gray
    opacity: 0.6,
    elevation: 0, // remove shadow to emphasize disabled state
  },

  disabledTextStyle: {
    color: "#777", // lighter gray text
  },
  toastContainer: {
    position: "absolute",
    bottom: "115%", // above the button; tweak this for exact distance
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10, // make sure it's above the button
    elevation: 10,
  },

  toastInner: {
    maxWidth: "90%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#111", // dark background
    opacity: 0.95,
  },

  toastTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
    textAlign: "center",
  },

  toastMessage: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
});
