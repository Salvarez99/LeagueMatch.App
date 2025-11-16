import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "85%",
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
