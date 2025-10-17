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

export default function FilterButton({ style, buttonStyle, textStyle }) {
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
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
        },
        style,
      ]}
    >
      {/* Main Filter Button */}
      <TouchableOpacity
        style={[styles.container, buttonStyle]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.text, textStyle]}>Filter</Text>
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
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
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
    top: Screen.height * 0.47,
    left: Screen.width * .45
    // bottom:0
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
