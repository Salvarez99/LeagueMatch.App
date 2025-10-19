import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../utils/dimensions";
import PickPositionModal from "./PickPositionModal";

export default function PickPositionButton({ style, buttonStyle, textStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonLayout, setButtonLayout] = useState(null); // store position
  const buttonRef = useRef(null);

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
      <PickPositionModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        buttonLayout={buttonLayout}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
      />
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
});
