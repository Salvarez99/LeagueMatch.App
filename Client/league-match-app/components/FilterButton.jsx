import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../utils/dimensions";
import FilterModel from "./FilterModel";

export default function FilterButton({ style, buttonStyle, textStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttonLayout, setButtonLayout] = useState(null);
  const buttonRef = useRef(null);

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
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

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
      {/* Main Filter Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.defaultButtonStyle, buttonStyle]}
        onPress={() => {
          buttonRef.current?.measure((fx, fy, width, height, px, py) => {
            setButtonLayout({ x: px, y: py, width, height });
            setIsOpen(true);
          });
        }}
      >
        <Text style={[styles.text, textStyle]}>Filter</Text>
      </TouchableOpacity>
      <FilterModel
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        buttonLayout={buttonLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  defaultButtonStyle: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.height * 0.07,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#000",
  }
});
