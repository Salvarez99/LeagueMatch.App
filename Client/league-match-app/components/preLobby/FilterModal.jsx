import { useEffect, useState } from "react";
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
import { styles } from "./styles/FilterModalStyle";

export default function FilterModal({
  visible,
  onClose,
  buttonLayout,
  setRankFilter,
}) {
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
    setSelectedOptions((prev) => {
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      setRankFilter(updated);
      return updated;
    });
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
