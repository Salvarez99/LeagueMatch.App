import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FilterModal from "./FilterModal";
import { styles } from "./styles/FilterButtonStyle";

export default function FilterButton({ setRankFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttonLayout, setButtonLayout] = useState(null);
  const buttonRef = useRef(null);

  return (
    <View style={styles.containerStyle}>
      {/* Main Filter Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.defaultButtonStyle}
        onPress={() => {
          buttonRef.current?.measure((fx, fy, width, height, px, py) => {
            setButtonLayout({ x: px, y: py, width, height });
            setIsOpen(true);
          });
        }}
      >
        <Text style={styles.text}>Filter</Text>
      </TouchableOpacity>
      <FilterModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        buttonLayout={buttonLayout}
        setRankFilter={setRankFilter}
      />
    </View>
  );
}
