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

export default function PickPositionButton({ style, buttonStyle, textStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ["Top", "Jungle", "Middle", "Adc", "Support"];
  const toggleOption = (option) => {
    const newSelection = selectedOption === option ? null : option;
    setSelectedOption(newSelection);
    setIsOpen(false);
    console.log(newSelection);
  };
  return (
    <View style={[styles.defaultContainerStyle, style]}>
      <TouchableOpacity
        style={[styles.defaultButtonStyle, buttonStyle]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.defaultTextStyle, textStyle]}>
          {selectedOption || "Position"}
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
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  defaultButtonStyle: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.width * 0.46,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultTextStyle: {
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
    left: Screen.width * 0.45,
    // bottom:0
  },
  optionButton: {
    padding: 10,
  },
  optionSelected: {
    backgroundColor: "#D0F0C0",
  },
});
