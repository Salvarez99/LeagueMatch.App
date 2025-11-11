import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  discordContainer: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
    padding: 8,
    paddingHorizontal: 10,
  },
  discordButton: {
    flex: 1,
    // backgroundColor: "rgba(88,101,242, 1)",
    borderRadius: 8,
    elevation: 5,
  },
  discordText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
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
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    color: "blue",
    fontWeight: "bold",
  },
  cancelButton: {
    color: "red",
  },
});
