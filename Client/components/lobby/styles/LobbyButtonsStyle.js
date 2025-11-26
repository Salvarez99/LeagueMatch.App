import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomButtonRow: {
    backgroundColor: "#C1C1C1",
    flex: 1.3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomButton: {
    width: "45%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  bottomButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
  },
});
