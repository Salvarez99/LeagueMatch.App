import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Screen from "../utils/dimensions";

export default function FilterModel({ visible, onClose, buttonLayout }) {
  if (!buttonLayout) return null;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    "Challenger",
    "Grandmaster",
    "Master",
    "Diamond",
    "Emerald",
    "Platinum",
    "Gold",
    "Silver",
    "Bronze",
    "Iron",
  ];

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Dropdown */}
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dropdown,
                {
                  position: "absolute",
                  top: buttonLayout.y - Screen.height * 0.38,
                  left:
                    buttonLayout.x + buttonLayout.width - Screen.width * 0.53,
                },
              ]}
            >
              <ScrollView>
                {options.map((option) => {
                  const isSelected = selectedOptions.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionSelected,
                      ]}
                      onPress={() => toggleOption(option)}
                    >
                      <Text style={isSelected && { fontWeight: "bold" }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)", // dimmed background
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    width: Screen.width * 0.53,
    maxHeight: Screen.height * 0.34,
    paddingVertical: 5,
    position: "absolute",
    // top: Screen.height * 0.47,
    // left: Screen.width * 0.45,
    // bottom:0
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
