import { overlayColor, surfaceColor, textColor } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RankFilterDropdownProps {
  value: string[];
  onSelect: (ranks: string[]) => void;
}

export default function RankFilterDropdown({
  value,
  onSelect,
}: RankFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(value || []);

  const ranks: string[] = [
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

  const toggleRank = (rank: string) => {
    let updated: string[] = [];

    if (selected.includes(rank)) {
      updated = selected.filter((r) => r !== rank);
    } else {
      updated = [...selected, rank];
    }

    setSelected(updated);
    onSelect(updated); // send updated selection to parent
  };

  return (
    <View style={styles.anchorContainer}>
      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
        <Ionicons name="options-outline" size={22} color="white" />
      </TouchableOpacity>

      {/* OVERLAY + DROPDOWN */}
      {open && (
        <>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

          <View style={styles.menu}>
            <ScrollView style={{ maxHeight: 200 }}>
              {ranks.map((rank) => {
                const isSelected = selected.includes(rank);

                return (
                  <TouchableOpacity
                    key={rank}
                    style={[styles.menuItem, isSelected && styles.selectedItem]}
                    onPress={() => toggleRank(rank)}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        isSelected && styles.selectedItemText,
                      ]}
                    >
                      {rank}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  anchorContainer: {
    flex: 1,
    position: "relative",
  },
  button: {
    backgroundColor: surfaceColor,
    aspectRatio: 1, // ← 🔥 makes it a perfect square
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: textColor,
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: -800,
    bottom: -800,
    left: -800,
    right: -800,
    zIndex: 5,
  },
  menu: {
    position: "absolute",
    bottom: "100%",
    right: 0, // anchor to the button’s right edge
    minWidth: 160, // wide enough for longest rank ("Grandmaster")
    backgroundColor: overlayColor,
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 8,
    zIndex: 10,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemText: {
    color: textColor,
    fontSize: 15,
  },
  selectedItem: {
    backgroundColor: "#3b3b3b",
  },
  selectedItemText: {
    color: "#4ade80", // green highlight
    fontWeight: "700",
  },
});
