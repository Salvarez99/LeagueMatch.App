import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/GameModeCardStyle";

export default function GameModeCard({
  gameMap,
  isFocused,
  selectedMode,
  onModeSelect,
}) {
  const [showModes, setShowModes] = useState(false);

  const handleCardPress = () => {
    if (isFocused) setShowModes(!showModes);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[styles.card, isFocused && styles.focused]}
    >
      <Text style={styles.title}>{gameMap.title}</Text>
      <Text style={styles.subTitle}>
        {selectedMode ? `${selectedMode}` : ""}
      </Text>

      {isFocused && showModes && (
        <View style={styles.dropdown}>
          {gameMap.modes.map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => {
                onModeSelect(gameMap.id, mode);
                setShowModes(false);
              }}
              style={styles.dropdownItem}
            >
              <Text>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
