// components/common/SheetOptionButton.tsx
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React from "react";
import { surfaceColor, overlayColor, textColor } from "@/utils/colors";

interface Props {
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function SheetOptionButton({
  onPress,
  icon,
  title,
  subtitle,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>{icon}</View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",               // full width of bottom sheet
    marginBottom: 14,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: surfaceColor,     // from your palette
    borderWidth: 1.5,
    borderColor: overlayColor,         // subtle border
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: overlayColor, // dark accent circle
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: textColor,
    marginTop: 2,
  },
});
