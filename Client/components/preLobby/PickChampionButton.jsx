import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PickChampionModal from "./PickChampionModal";
import { styles } from "./styles/PickChampionButtonStyle";

export default function PickChampionButton({ setChampionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [championName, setChampionName] = useState("Pick Champion");

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={styles.defaultButtonStyle}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.defaultTextStyle}>{championName}</Text>
      </TouchableOpacity>
      <PickChampionModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        setChampionId={setChampionId}
        setChampionName={setChampionName}
      />
    </View>
  );
}
