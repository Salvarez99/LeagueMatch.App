import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PickChampionModal from "./PickChampionModal";
import { styles } from "./styles/PickChampionButtonStyle";

export default function PickChampionButton({
  style,
  buttonStyle,
  textStyle,
  setChampionId,
}) {
  const [buttonLayout, setButtonLayout] = useState(null); // store position
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={[styles.containerStyle, style]}>
      <TouchableOpacity
        style={[styles.defaultButtonStyle, buttonStyle]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.defaultTextStyle, textStyle]}>Pick Champion</Text>
      </TouchableOpacity>
      <PickChampionModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        setChampionId={setChampionId}
      />
    </View>
  );
}
