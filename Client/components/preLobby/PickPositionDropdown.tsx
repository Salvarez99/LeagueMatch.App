import { overlayColor, surfaceColor, textColor } from "@/utils/colors";
import { useState, useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PickPositionDropdownProps {
  items: string[];
  value: string;
  onSelect: (pos: string) => void;
  gameMap: string;
}

export default function PickPositionDropdown({
  items,
  value,
  onSelect,
  gameMap,
}: PickPositionDropdownProps) {
  const [open, setOpen] = useState(false);
  const isSR = gameMap === "Summoner's Rift";

  const [showDisabledToast, setShowDisabledToast] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  const showToast = () => {
    // Clear any existing timer so it resets if spammed
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowDisabledToast(true);

    timeoutRef.current = setTimeout(() => {
      setShowDisabledToast(false);
    }, 1500); // visible for 2.5s (tweak as you like)
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 🔹 Non-SR: disabled button + toast behavior
  if (!isSR) {
    return (
      <View style={styles.anchorContainer}>
        {/* Toast overlay */}
        {showDisabledToast && (
          <View
            pointerEvents="none" // let touches pass through to button
            style={styles.toastContainer}
          >
            <View style={styles.toastInner}>
              {/* <Text style={styles.toastTitle}>Champion pick disabled</Text> */}
              <Text style={styles.toastMessage}>
                {gameMap} doesn&apos;t support picking a position.
              </Text>
            </View>
          </View>
        )}

        {/* Disabled button */}
        <TouchableWithoutFeedback onPress={showToast}>
          <View style={[styles.button, styles.disabledButtonStyle]}>
            <Text style={[styles.disabledTextStyle]}>Pick Position</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
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
            <ScrollView style={{ maxHeight: 180 }}>
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
    backgroundColor: surfaceColor,
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: textColor,
    fontSize: 14,
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
  disabledButtonStyle: {
    backgroundColor: "#2c2c2c", // darker gray
    opacity: 0.6,
    elevation: 0, // remove shadow to emphasize disabled state
  },

  disabledTextStyle: {
    color: "#777", // lighter gray text
  },
  toastContainer: {
    position: "absolute",
    bottom: "115%", // above the button; tweak this for exact distance
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10, // make sure it's above the button
    elevation: 10,
  },

  toastInner: {
    maxWidth: "90%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#111", // dark background
    opacity: 0.95,
  },

  toastTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
    textAlign: "center",
  },

  toastMessage: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
});
