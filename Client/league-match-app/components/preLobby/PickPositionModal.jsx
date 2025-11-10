import { useEffect } from "react";
import {
  BackHandler,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Screen from "../../utils/dimensions";
import { styles } from "./styles/PickPositionModalStyle";

export default function FilterModal({
  visible,
  onClose,
  setSelectedOption,
  buttonLayout,
  selectedOption,
  setPosition,
}) {
  if (!buttonLayout) return null;
  const options = ["Top", "Jungle", "Middle", "Adc", "Support"];

  const toggleOption = (option) => {
    const newSelection = selectedOption === option ? null : option;
    setSelectedOption(newSelection);
    setPosition(newSelection);
    onClose();
    // console.log(newSelection);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose(); // tell parent to close modal
          return true; // prevent default
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  if (!visible || !buttonLayout) return null;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
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
