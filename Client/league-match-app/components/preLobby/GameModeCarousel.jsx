import { useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Screen from "../../utils/dimensions";
import GameModeCard from "./GameModeCard";
import { styles } from "./styles/GameModeCarouselStyle";

export default function GameModeCarousel({
  style,
  itemStyle,
  itemTextStyle,
  setGameMode,
  setGameMap,
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedModes, setSelectedModes] = useState({});
  const progress = useSharedValue(0);

  const handleModeSelect = (mapId, mode) => {
    setSelectedModes({ [mapId]: mode });
    if (setGameMode) setGameMode(mode);
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
    <View style={[styles.containerStyle, style]}>
      <Carousel
        data={DATA}
        width={Screen.width} // 👈 take full screen width
        height={"100%"}
        loop
        pagingEnabled
        snapEnabled
        autoPlay={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: (Screen.width - Screen.width * 0.5) / 2, // centers focused card peek in
        }}
        style={styles.carouselStyle}
        onProgressChange={progress}
        onSnapToItem={(index) => {
          const realIndex = index % DATA.length;
          setFocusedIndex(realIndex);
          setSelectedModes({});
          if (setGameMap) setGameMap(DATA[realIndex].title);
        }}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.itemContainerStyle}>
              <GameModeCard
                gameMap={item}
                gameMode={item.modes}
                isFocused={index === focusedIndex}
                selectedMode={selectedModes[item.id]}
                onModeSelect={handleModeSelect}
                itemStyle={[itemStyle, styles.cardStyle]}
                itemTextStyle={itemTextStyle}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
