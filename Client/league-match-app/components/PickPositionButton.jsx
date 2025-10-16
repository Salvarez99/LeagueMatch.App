import { Text, TouchableOpacity, View } from "react-native";
import Screen from "../utils/dimensions";

export default function PickPositionButton({ style, buttonStyle, textStyle }) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "green",
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          {
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.07,
            width: Screen.width * 0.46,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
          },
          buttonStyle,
        ]}
      >
        <Text
          style={[
            {
              fontSize: 14,
              color: "#000",
            },
            textStyle,
          ]}
        >
          Position
        </Text>
      </TouchableOpacity>
    </View>
  );
}
