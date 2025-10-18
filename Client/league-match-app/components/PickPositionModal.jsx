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

export default function FilterModal({
  visible,
  onClose,
  setSelectedOption,
  buttonLayout,
  selectedOption
}) {
  if (!buttonLayout) return null;
  const options = ["Top", "Jungle", "Middle", "Adc", "Support"];

  const toggleOption = (option) => {
    const newSelection = selectedOption === option ? null : option;
    setSelectedOption(newSelection);
    onClose();
    console.log(newSelection);
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
                  top: buttonLayout.y - 205,
                  left:
                    buttonLayout.x + buttonLayout.width - Screen.width * 0.53,
                },
              ]}
            >
              <ScrollView>
                {options.map((option) => {
                  const isSelected = selectedOption === option;
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
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    width: Screen.width * 0.53,
    maxHeight: Screen.height * 0.34,
    paddingVertical: 5,
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
