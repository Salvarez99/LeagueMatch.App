// components/modals/GhostModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { addGhost } from "@/types/ILobbyApiRequest";
import { styles } from "./styles/GhostModalStyle";

interface GhostModalProps {
  visible: boolean;
  gameMap: string;
  slotIndex: number | null;
  onSubmit: (data: addGhost) => void;
  onClose: () => void;

  // Optional future: editing a ghost
  initialGhostData?: addGhost;
}

export default function GhostModal({
  visible,
  gameMap,
  slotIndex,
  onSubmit,
  onClose,
  initialGhostData,
}: GhostModalProps) {
  const isEditing = Boolean(initialGhostData);

  // Modal steps:
  // step 0 = ask if they want to add a ghost
  // step 1 = show ghost form
  const [step, setStep] = useState(0);

  // State for ghost data
  const [position, setPosition] = useState<string | null>(
    initialGhostData?.position ?? null
  );

  //------------------------------------------------------
  // HANDLERS
  //------------------------------------------------------
  const handleConfirm = () => setStep(1);

  const handleSubmit = () => {
    if (slotIndex === null) return;
    console.log(slotIndex)
    const ghostPayload: addGhost = {
      // slotIndex,
      ghostId: "Test Ghost",
      index: slotIndex + 1,
      gameMap,
      position: position ?? undefined,
      // later you can add championId, name, rank, etc.
    };

    onSubmit(ghostPayload);
  };

  console.log(gameMap);

  const handleCancel = () => {
    setStep(0); // reset steps for next time
    setPosition(null);
    onClose();
  };

  //------------------------------------------------------
  // UI COMPONENTS
  //------------------------------------------------------

  const renderConfirmationStep = () => (
    <View style={styles.modalBody}>
      <Text style={styles.title}>
        {isEditing ? "Update Ghost?" : "Add a Ghost to this Slot?"}
      </Text>

      <Text style={styles.text}>
        {isEditing
          ? "Would you like to update this ghost's details?"
          : "Would you like to add a ghost player to this empty slot?"}
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
        <Text style={styles.title}>
          {isEditing ? "Edit Ghost" : "Ghost Details"}
        </Text>

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

        {/* LATER: Add champion picker, invite friend, nickname, etc. */}

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
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {step === 0 ? renderConfirmationStep() : renderFormStep()}
        </View>
      </View>
    </Modal>
  );
}
