import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PickChampionModal from "./PickChampionModal";
import { styles } from "./styles/PickChampionButtonStyle";

export default function PickChampionButton({ setChampionId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.defaultButtonStyle}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.defaultTextStyle}>Pick Champion</Text>
      </TouchableOpacity>
      <PickChampionModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        setChampionId={setChampionId}
      />
    </View>
  );
}
