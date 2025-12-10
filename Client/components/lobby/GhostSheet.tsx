// components/modals/GhostSheet.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { addGhost } from "@/types/ILobbyApiRequest";
import { styles } from "./styles/GhostModalStyle";

interface GhostSheetProps {
  gameMap: string;
  slotIndex: number | null;
  onSubmit: (data: addGhost) => void;
  onBack: () => void;      // go to base screen
  onExit: () => void;      // close sheet entirely
  initialGhostData?: addGhost;
}

export default function GhostSheet({
  gameMap,
  slotIndex,
  onSubmit,
  onBack,
  onExit,
  initialGhostData,
}: GhostSheetProps) {
  const isEditing = Boolean(initialGhostData);

  // step 0 = confirm add
  // step 1 = ghost form
  const [step, setStep] = useState(0);

  const [position, setPosition] = useState<string | null>(
    initialGhostData?.position ?? null
  );

  // Reset state whenever the sheet is re-opened
  useEffect(() => {
    setStep(0);
    setPosition(initialGhostData?.position ?? null);
  }, [slotIndex]);

  //------------------------------------------------------
  // HANDLERS
  //------------------------------------------------------

  const handleConfirm = () => setStep(1);

  const handleSubmit = () => {
    if (slotIndex === null) return;

    const ghostPayload: addGhost = {
      ghostId: "Test Ghost",
      index: slotIndex + 1,
      gameMap,
      position: position ?? undefined,
    };

    onSubmit(ghostPayload);
    onBack(); // return to the base bottom sheet
  };

  const handleCancel = () => {
    setStep(0);
    setPosition(null);
    onBack(); // Bring user back to base menu
  };

  //------------------------------------------------------
  // UI STEPS
  //------------------------------------------------------

  const renderConfirmationStep = () => (
    <View style={styles.modalBody}>
      <Text style={styles.title}>
        {isEditing ? "Update Ghost?" : "Add a Ghost?"}
      </Text>

      <Text style={styles.text}>
        {isEditing
          ? "Would you like to update this ghost's details?"
          : "Would you like to add a ghost player to this slot?"}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFormStep = () => {
    const isSR = gameMap === "Summoner's Rift";

    return (
      <View style={styles.modalBody}>
        <Text style={styles.title}>{isEditing ? "Edit Ghost" : "Ghost Details"}</Text>

        {/* POSITION (SR ONLY) */}
        {isSR && (
          <>
            <Text style={[styles.text, { marginTop: 10 }]}>
              Select Position:
            </Text>

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
          </>
        )}

        <View style={[styles.row, { marginTop: 20 }]}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleSubmit}
            disabled={isSR && !position}
          >
            <Text style={styles.buttonText}>
              {isEditing ? "Update Ghost" : "Add Ghost"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      {step === 0 ? renderConfirmationStep() : renderFormStep()}
    </View>
  );
}
