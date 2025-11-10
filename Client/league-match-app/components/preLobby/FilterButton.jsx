import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FilterModel from "./FilterModal";
import { styles } from "./styles/FilterButtonStyle";
export default function FilterButton({
  style,
  buttonStyle,
  textStyle,
  setRankFilter,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttonLayout, setButtonLayout] = useState(null);
  const buttonRef = useRef(null);

  return (
    <View style={[styles.containerStyle, style]}>
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
        setRankFilter={setRankFilter}
      />
    </View>
  );
}
