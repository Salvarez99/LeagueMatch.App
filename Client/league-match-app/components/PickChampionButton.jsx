import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../utils/dimensions";
import PickChampionModal from "./PickChampionModal";

export default function PickChampionButton({ style, buttonStyle, textStyle }) {
  const [buttonLayout, setButtonLayout] = useState(null); // store position
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
      <TouchableOpacity
        style={[styles.defaultButtonStyle, buttonStyle]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.defaultTextStyle, textStyle]}>Pick Champion</Text>
      </TouchableOpacity>
      <PickChampionModal visible={isOpen} onClose={() => setIsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
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
