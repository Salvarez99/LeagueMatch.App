// components/modals/GhostSheet.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { addGhost } from "@/types/ILobbyApiRequest";
import { styles } from "./styles/GhostModalStyle";

interface GhostSheetProps {
  gameMap: string;
  slotIndex: number | null;
  onSubmit: (data: addGhost) => void;
  onBack: () => void; // go to base screen
  initialGhostData?: addGhost;
}

export default function GhostSheet({
  gameMap,
  slotIndex,
  onSubmit,
  onBack,
  initialGhostData,
}: GhostSheetProps) {
  const isEditing = Boolean(initialGhostData);
  const [position, setPosition] = useState<string | null>(
    initialGhostData?.position ?? null
  );

  // Reset state when sheet reopens
  useEffect(() => {
    setPosition(initialGhostData?.position ?? null);
  }, [slotIndex]);

  //------------------------------------------------------

  const handleSubmit = () => {
    if (slotIndex === null) return;

    const ghostPayload: addGhost = {
      ghostId: "Test Ghost",
      index: slotIndex + 1,
      gameMap,
      position: position ?? undefined,
    };
    console.log(ghostPayload);
    onSubmit(ghostPayload);
    onBack();
  };

  const handleCancel = () => {
    setPosition(null);
    onBack();
  };

  //------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      {gameMap === "Summoner's Rift" ? (
        // Only render the form when SR
        <View style={styles.modalBody}>
          <Text style={styles.title}>
            {isEditing ? "Edit Ghost" : "Ghost Details"}
          </Text>

          <Text style={[styles.text, { marginTop: 10 }]}>Select Position:</Text>

          <View style={styles.row}>
            {["Top", "Jungle", "Middle", "Adc", "Support"].map((pos) => (
              <TouchableOpacity
                key={pos}
                style={[
                  styles.option,
                  position === pos && styles.optionSelected,
                ]}
                onPress={() => setPosition(pos)}
              >
                <Text style={styles.optionText}>{pos}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.row, { marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSubmit}
              disabled={!position}
            >
              <Text style={styles.buttonText}>
                {isEditing ? "Update Ghost" : "Add Ghost"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Otherwise show nothing—auto-submit handles everything
        <View />
      )}
    </View>
  );
}
