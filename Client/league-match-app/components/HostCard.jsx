import { Text, TouchableOpacity, View } from "react-native";
import Screen from "../utils/dimensions";

export default function HostCard({ style, buttonStyle, textStyle }) {
  return (
    <View
      style={[
        {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          {
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.12,
            width: Screen.width * 0.94,
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
          Host Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}
