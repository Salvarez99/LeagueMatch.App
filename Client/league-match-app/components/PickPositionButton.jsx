import { useRef, useState } from "react";
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
  const [buttonLayout, setButtonLayout] = useState(null); // store position
  const buttonRef = useRef(null);

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
        ref={buttonRef}
        style={[styles.defaultButtonStyle, buttonStyle]}
        onPress={() => {
          // Measure the button before opening modal
          buttonRef.current?.measureInWindow((x, y, width, height) => {
            setButtonLayout({ x, y, width, height });
            setIsOpen(true);
          });
        }}
      >
        <Text style={[styles.defaultTextStyle, textStyle]}>
          {selectedOption || "Position"}
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Modal Overlay */}
      <Modal transparent visible={isOpen} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  buttonLayout && {
                    position: "absolute",
                    top: buttonLayout.y - Screen.height * 0.15, // position above button
                    left:
                      buttonLayout.x + buttonLayout.width - Screen.width * 0.53, // align right edge
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
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
