import { View, Text, TouchableOpacity } from "react-native";
import Screen from "../utils/dimensions";

export default function GameModeCarousel() {
  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        width: Screen.width,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "green",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#D9D9D9",
          height: Screen.height * 0.48,
          width: Screen.width * 0.8,
          borderRadius: 15,
          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#000",
          }}
        >
          Gamemode Select
        </Text>
      </TouchableOpacity>
    </View>
  );
}
