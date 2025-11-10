import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PickPositionModal from "./PickPositionModal";
import { styles } from "./styles/PickPositionButtonStyle";

export default function PickPositionButton({
  style,
  buttonStyle,
  textStyle,
  setPosition,
}) {
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
        setPosition={setPosition}
      />
    </View>
  );
}
