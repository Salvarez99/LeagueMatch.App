import { StyleSheet } from "react-native";
import Screen from "../../utils/dimensions";


export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // backgroundColor: "brown",
  },
  gameModeHeaderContainerStyle: {
    flex: 1.3,
    padding: 8,
    paddingBottom: 0,
    // backgroundColor: "red",
  },
  hostCardContainerStyle: {
    flex: 3,
    // backgroundColor: "pink",
  },
  carouselContainerStyle: {
    flex: 10,
    padding: 0,
    margin: 0,
    // backgroundColor: "purple",
  },
  carouselItemStyle: {
    height: Screen.height * 0.445,
  },
  champPosContainerStyle: {
    flex: 1.8,
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  lobbyFilterContainerStyle: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    // backgroundColor: "blue",
  },
});
