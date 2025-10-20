import { useState } from "react";
import { FlatList, View } from "react-native";
import GameModeCard from "./GameModeCard";

export default function GameModeCarousel({
  style,
  itemStyle,
  itemTextStyle,
  setGameMode,
  setGameMap,
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedModes, setSelectedModes] = useState({});

  const handleModeSelect = (mapId, mode) => {
    setSelectedModes({ [mapId]: mode }); // clears previous
    setGameMode(mode);
  };

  const DATA = [
    {
      id: "1",
      title: "Summoner's Rift",
      modes: ["Swift Play", "Draft Pick", "Ranked Solo/Duo", "Ranked Flex"],
    },
    { id: "2", title: "Aram", modes: [] },
    {
      id: "3",
      title: "Featured Modes",
      modes: ["Arena", "Brawl", "Doom Bots"],
    },
  ];

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
        renderItem={({ item, index }) => (
          <GameModeCard
            gameMap={item}
            isFocused={index === focusedIndex}
            selectedMode={selectedModes[item.id]}
            onModeSelect={handleModeSelect}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        pagingEnabled
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width
          );
          setFocusedIndex(newIndex);
          setSelectedModes({}); // ✅ clears previous mode on scroll
          setGameMap(DATA[newIndex].title); // ✅ update parent’s map state
          setGameMode(""); // ✅ clear mode when switching maps
        }}
      />
    </View>
  );
}
