import { useState } from "react";
import { View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import GameModeCard from "./GameModeCard";
import Screen from "../../utils/dimensions";

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
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent", // keep background clean
          padding: 0,
          margin: 0,
        },
        style,
      ]}
    >
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
        style={{
          flex: 1,
          alignSelf: "center", // 👈 keeps it centered
          // backgroundColor: "green",
        }}
        onProgressChange={progress}
        onSnapToItem={(index) => {
          const realIndex = index % DATA.length;
          setFocusedIndex(realIndex);
          setSelectedModes({});
          if (setGameMap) setGameMap(DATA[realIndex].title);
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flex: 1,
                width: Screen.width * 0.85, // wrapper width
                alignSelf: "center",
                backgroundColor: "rgba(255, 255, 255, 0)", // or your app background color
              }}
            >
              <GameModeCard
                gameMap={item}
                gameMode={item.modes}
                isFocused={index === focusedIndex}
                selectedMode={selectedModes[item.id]}
                onModeSelect={handleModeSelect}
                itemStyle={[
                  itemStyle,
                  {
                    width: "100%",
                    borderRadius: 15,
                    // overflow: "hidden",
                  },
                ]}
                itemTextStyle={itemTextStyle}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
