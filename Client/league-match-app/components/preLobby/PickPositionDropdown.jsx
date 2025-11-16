import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PickPositionDropdown({ items, value, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.anchorContainer}>
      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
        <Text style={styles.buttonText}>{value || "Pick Position"}</Text>
      </TouchableOpacity>

      {/* OVERLAY + DROPDOWN */}
      {open && (
        <>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

          <View style={styles.menu}>
            <ScrollView style={{ maxHeight: 150 }}>
              {items.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={styles.menuItem}
                  onPress={() => {
                    onSelect(pos);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.menuItemText}>{pos}</Text>
                </TouchableOpacity>
              ))}
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
    paddingVertical: 14,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
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
    width: "100%",
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
});
