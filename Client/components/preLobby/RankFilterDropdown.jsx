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

export default function RankFilterDropdown({ value, onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || []);

  const ranks = [
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

  const toggleRank = (rank) => {
    let updated = [];

    if (selected.includes(rank)) {
      updated = selected.filter((r) => r !== rank);
    } else {
      updated = [...selected, rank];
    }

    setSelected(updated);
    onSelect(updated); // send updated selection to PreLobby
  };

  return (
    <View style={styles.anchorContainer}>
      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
        <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
          <Ionicons name="options-outline" size={22} color="white" />
        </TouchableOpacity>
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
    width: "100%",
    aspectRatio: 1, // ← 🔥 makes it a perfect square
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  buttonText: {
    color: "#fff",
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
    backgroundColor: "#2a2a2a",
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
    color: "white",
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
