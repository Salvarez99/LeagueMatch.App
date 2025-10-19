import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../utils/dimensions";

export default function GameModeCarousel({ style, itemStyle, itemTextStyle }) {
  const DATA = [
    { id: "1", title: "Summoner's Rift" },
    { id: "2", title: "Aram" },
    { id: "3", title: "Arena" },
    { id: "4", title: "Doom Bots" },
  ];

  const ListItem = ({ title }) => (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "#D9D9D9",
          height: Screen.height * 0.48,
          width: Screen.width * 0.8,
          borderRadius: 15,
          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
        },
        itemStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 16,
            color: "#000",
            fontWeight: "500",
          },
          itemTextStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <FlatList
        data={DATA}
        renderItem={({ item }) => <ListItem title={item.title} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        pagingEnabled
      />
    </View>
  );
}
