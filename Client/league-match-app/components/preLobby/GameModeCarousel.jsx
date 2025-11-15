import { useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Screen from "../../utils/dimensions";
import GameModeCard from "./GameModeCard";

export default function GameModeCarousel({ setGameMode, setGameMap }) {
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
    <Carousel
      data={DATA}
      width={Screen.width}
      height={Screen.height * 0.48}
      loop
      pagingEnabled
      snapEnabled
      autoPlay={false}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.95,
        parallaxScrollingOffset: (Screen.width * 0.35) / 2, // centers focused card peek in
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
          <GameModeCard
            gameMap={item}
            gameMode={item.modes}
            isFocused={index === focusedIndex}
            selectedMode={selectedModes[item.id]}
            onModeSelect={handleModeSelect}
          />
        );
      }}
    />
  );
}
