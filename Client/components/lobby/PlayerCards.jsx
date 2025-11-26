// PlayerCards.tsx
import { useState } from "react";
import { View } from "react-native";
import PlayerCard from "./PlayerCard";
import { styles } from "./styles/PlayerCardsStyle";

export default function PlayerCards({
  style,
  players = [],
  maxPlayers,
  isHost = false,
  onKick,
  onUpdateChampion,
}) {
  const actualMaxPlayers = (maxPlayers ?? 5) - 1;
  const [selectedPlayerUid, setSelectedPlayerUid] = useState(null);

  // Create empty slots for remaining players
  const slots = Array.from({ length: actualMaxPlayers });

  return (
    <View style={[styles.playersContainer, style]}>
      {slots.map((_, index) => {
        const player = players[index];
        return (
          <PlayerCard
            key={index}
            isHost={isHost}
            player={player}
            isEmpty={!player}
            setSelectedPlayerUid={setSelectedPlayerUid}
            selectedPlayerUid={selectedPlayerUid}
            onKick={onKick}
            onChampionSelect={onUpdateChampion}
          />
        );
      })}
    </View>
  );
}
