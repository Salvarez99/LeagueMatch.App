import { View, Text } from "react-native";
import Screen from "../utils/dimensions";

export default function GameModeHeader({style, textStyle}) {
  return (
    <View
      style={[{
        flex:1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "red",
      },style]}
    >
      <View
        style={{
          flex:1,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#000",
          }}
        >
          Summoner's Rift 5v5
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#000",
          }}
        >
          Normal
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#D9D9D9",
          height: Screen.height * 0.05,
          width: Screen.height * 0.05,
          borderRadius: 15,
          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
    </View>
  );
}
