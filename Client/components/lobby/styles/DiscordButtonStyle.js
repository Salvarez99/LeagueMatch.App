import { overlayColor, surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  discordContainer: {
    justifyContent: "center",
    height:"11%",
    padding: 8,
    paddingHorizontal: 10,
  },
  discordButton: {
    height:"100%",
    borderRadius: 8,
    elevation: 5,
    backgroundColor:surfaceColor,
  },
  discordText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  defaultTextStyle: {
    fontSize: 14,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: surfaceColor,
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color:textColor,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color:textColor,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    color: textColor,
    fontWeight: "bold",
  },
  cancelButton: {
    color: "red",
  },
});
