// PlayerCards.tsx
import { useState } from "react";
import { View } from "react-native";
import PlayerCard from "./PlayerCard";
import { styles } from "./styles/PlayerCardsStyle";
import { ILobbyPlayer } from "@leaguematch/shared";
import { addGhost, updateGhost } from "@/types/ILobbyApiRequest";

interface PlayerCardsProps {
  style: any;
  players: ILobbyPlayer[];
  maxPlayers: number;
  isHost: boolean;
  onKick: (targetUid: string) => void;
  onUpdateChampion: (uid: string, championId: string) => void;
  onAddGhost: (data: addGhost) => void;
  onUpdateGhost: (data: updateGhost) => void;
}

export default function PlayerCards({
  style,
  players = [],
  maxPlayers,
  isHost = false,
  onKick,
  onUpdateChampion,
  onAddGhost,
  onUpdateGhost,
}: PlayerCardsProps) {
  const actualMaxPlayers: number = (maxPlayers ?? 5) - 1;
  const [selectedPlayerUid, setSelectedPlayerUid] = useState<string | null>(
    null
  );

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
            player={player ?? null}
            isEmpty={!player}
            setSelectedPlayerUid={setSelectedPlayerUid}
            selectedPlayerUid={selectedPlayerUid}
            onKick={onKick}
            onChampionSelect={onUpdateChampion}
            onAddGhost={onAddGhost}
            onUpdateGhost={onUpdateGhost}
          />
        );
      })}
    </View>
  );
}
