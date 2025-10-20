import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../utils/dimensions";

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
      style={[
        {
          backgroundColor: "#D9D9D9",
          height: Screen.height * 0.48,
          width: Screen.width * 0.8,
          borderRadius: 15,
          elevation: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
        },
        isFocused && styles.focused,
      ]}
    >
      <Text style={styles.title}>
        {gameMap.title}
      </Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
  },
  focused: {
    borderWidth: 2,
    borderColor: "#00eeffff",
    backgroundColor: "#8e8e8eff",
  },
  title: {
    color: "#fff",
    fontSize: 18,
  },
    subTitle: {
    color: "#fff",
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#C1C1C1",
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 8,
  },
});
