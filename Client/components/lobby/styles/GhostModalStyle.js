import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#1E1E1E",
  },
  modalBody: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    color: "#ccc",
    marginVertical: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#444",
    margin: 4,
  },
  optionSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  optionText: {
    color: "white",
  },
});
