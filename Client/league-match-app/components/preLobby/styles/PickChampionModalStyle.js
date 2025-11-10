import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    height: Screen.height * 0.7,
    padding: 10,
    paddingTop: 15,
    position: "absolute",
    top: "9%",
  },
  champButton: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  champIcon: {
    width: Screen.width * 0.18,
    height: Screen.width * 0.18,
    borderRadius: 8,
  },
  champName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },

  roleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: Screen.width * 0.115,
    height: Screen.height * 0.05,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    elevation: 5,
  },

  roleButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 5,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  listEmptyStyle: { textAlign: "center", marginTop: 20 },
});
