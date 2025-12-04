import { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import PickChampionModal from "./PickChampionModal";
import { styles } from "./styles/PickChampionButtonStyle";

interface PickChampionButtonProps {
  setChampionId: (id: string) => void;
  gameMap: string;
}

export default function PickChampionButton({
  setChampionId,
  gameMap,
}: PickChampionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [championName, setChampionName] = useState("Pick Champion");
  const isSR = gameMap === "Summoner's Rift";

  const [showDisabledToast, setShowDisabledToast] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  const showToast = () => {
    // Clear any existing timer so it resets if spammed
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowDisabledToast(true);

    timeoutRef.current = setTimeout(() => {
      setShowDisabledToast(false);
    }, 1500); // visible for 2.5s (tweak as you like)
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 🔹 Non-SR: disabled button + toast behavior
  if (!isSR) {
    return (
      <View style={styles.containerStyle}>
        {/* Toast overlay */}
        {showDisabledToast && (
          <View
            pointerEvents="none" // let touches pass through to button
            style={styles.toastContainer}
          >
            <View style={styles.toastInner}>
              {/* <Text style={styles.toastTitle}>Champion pick disabled</Text> */}
              <Text style={styles.toastMessage}>
                {gameMap} doesn&apos;t support picking a champion.
              </Text>
            </View>
          </View>
        )}

        {/* Disabled button */}
        <TouchableWithoutFeedback onPress={showToast}>
          <View style={[styles.defaultButtonStyle, styles.disabledButtonStyle]}>
            <Text style={[styles.defaultTextStyle, styles.disabledTextStyle]}>
              Pick Champion
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.defaultButtonStyle}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.defaultTextStyle}>{championName}</Text>
      </TouchableOpacity>

      <PickChampionModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        setChampionId={setChampionId}
        setChampionName={setChampionName}
      />
    </View>
  );
}
