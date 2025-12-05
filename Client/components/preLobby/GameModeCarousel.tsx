import { useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Screen from "../../utils/dimensions";
import GameModeCard from "./GameModeCard";

interface GameMap {
  id: string;
  title: string;
  modes: string[];
}

interface GameModeCarouselProps {
  setGameMode: (mode: string) => void;
  setGameMap: (mapTitle: string) => void;
}

export default function GameModeCarousel({
  setGameMode,
  setGameMap,
}: GameModeCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedModes, setSelectedModes] = useState<Record<string, string>>({});
  const progress = useSharedValue(0);

  const handleModeSelect = (mapId: string, mode: string) => {
    setSelectedModes({ [mapId]: mode });
    setGameMode?.(mode);
  };

  const DATA: GameMap[] = [
    {
      id: "1",
      title: "Summoner's Rift",
      modes: ["Swift Play", "Draft Pick", "Ranked Solo/Duo", "Ranked Flex"],
    },
    { id: "2", title: "Aram", modes: ["Howling Abyss", "Mayhem"] },
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
        parallaxScrollingOffset: (Screen.width * 0.35) / 2,
      }}
      onProgressChange={progress}
      onSnapToItem={(index) => {
        const realIndex = index % DATA.length;
        setFocusedIndex(realIndex);
        setSelectedModes({});
        setGameMode("");
        setGameMap?.(DATA[realIndex].title);
      }}
      renderItem={({ item, index }) => (
        <GameModeCard
          gameMap={item}
          isFocused={index === focusedIndex}
          selectedMode={selectedModes[item.id] ?? ""}
          onModeSelect={handleModeSelect}
        />
      )}
    />
  );
}
