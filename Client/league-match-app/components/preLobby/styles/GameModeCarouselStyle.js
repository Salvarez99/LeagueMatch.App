import { StyleSheet } from "react-native";
import Screen from "../../../utils/dimensions";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // keep background clean
    padding: 0,
    margin: 0,
  },
  carouselStyle: {
    flex: 1,
    alignSelf: "center", // 👈 keeps it centered
    // backgroundColor: "green",
  },
  itemContainerStyle: {
    flex: 1,
    width: Screen.width * 0.85, // wrapper width
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0)", // or your app background color
  },
  cardStyle: {
    width: "100%",
    borderRadius: 15,
    // overflow: "hidden",
  },
});
