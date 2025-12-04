import { overlayColor, surfaceColor, textColor } from "@/utils/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: surfaceColor,
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "85%",
  },
  focused: {
    borderWidth: 2,
    borderColor: "#0083fdff",
    backgroundColor: surfaceColor,
  },
  title: {
    color: textColor,
    fontSize: 18,
  },
  subTitle: {
    color: textColor,
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: overlayColor,
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 8,
  },
  itemText: {
    color: textColor,
  },
});
