import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    width: "100%", // now matches wrapper
    marginHorizontal: 0, // remove extra spacing
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: Screen.height * 0.48,
  },
  focused: {
    borderWidth: 2,
    borderColor: "#00eeffff",
    backgroundColor: "#8e8e8eff",
  },
  title: {
    color: "#fff",
    fontSize: 18,
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#C1C1C1",
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 8,
  },
});
