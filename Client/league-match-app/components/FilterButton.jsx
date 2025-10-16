import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Screen from "../utils/dimensions";

export default function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);
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
    <View>
      {/* Main Filter Button */}
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.text}>
          Filter
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Modal Overlay */}
      <Modal transparent visible={isOpen} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            {/* Dropdown */}
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.height * 0.07,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)", // dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    width: Screen.height * 0.25,
    maxHeight: Screen.height * 0.4,
    paddingVertical: 5,
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
