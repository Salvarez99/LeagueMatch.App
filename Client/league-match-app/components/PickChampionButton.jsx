import { Text, TouchableOpacity } from "react-native";
import Screen from "../utils/dimensions";

export default function PickChampionButton({ style, buttonStyle }) {
  return (
    <TouchableOpacity
      style={[
        {
          flex: 1,
          backgroundColor: "#D9D9D9",
          height: Screen.height * 0.07,
          width: Screen.width * 0.46,
          borderRadius: 15,
          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
          // paddingHorizontal: 10,
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 14,
            color: "#000",
          },
          buttonStyle,
        ]}
      >
        Pick Champion
      </Text>
    </TouchableOpacity>
  );
}
