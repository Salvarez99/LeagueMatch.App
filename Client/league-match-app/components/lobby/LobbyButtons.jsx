import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbyButtonsStyle";

export default function LobbyButtons({ style, onLeave, onReady, status }) {
  const [disabled, setDisabled] = useState(false);

  const outlineColor = status ? "#00C851" : "#ff4444"; // green / red
  const label = status ? "Unready" : "Ready";

  const handleReady = async () => {
    if (disabled) return;

    // Temporarily disable to prevent spam
    setDisabled(true);

    try {
      await onReady();
    } finally {
      // Re-enable after a short delay (prevents rapid API calls)
      setTimeout(() => setDisabled(false), 300);
    }
  };

  return (
    <View style={[styles.bottomButtonRow, style]}>
      {/* Ready / Unready Button */}
      <TouchableOpacity
        style={[
          styles.bottomButton,
          {
            backgroundColor: "#D9D9D9",
            borderWidth: 2,
            borderColor: outlineColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={handleReady}
        disabled={disabled}
      >
        <Text style={styles.defaultTextStyle}>{label}</Text>
      </TouchableOpacity>

      {/* Leave Button */}
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#D9D9D9" }]}
        onPress={onLeave}
      >
        <Text style={styles.defaultTextStyle}>Leave</Text>
      </TouchableOpacity>
    </View>
  );
}
