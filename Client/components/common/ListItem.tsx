import { View, Text, StyleSheet, Image } from "react-native";
import { surfaceColor, textColor, overlayColor } from "@/utils/colors";

interface Props {
  username: string;
  availability: "Online" | "Away" | "Offline";
  statusMessage: string;
  onPress: ()=>void;
}

export default function ListItem({ username, availability, statusMessage, onPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileImagePlaceholder} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{username}</Text>
          <View style={[styles.availabilityBadge, getAvailabilityStyle(availability)]}>
            <Text style={styles.availabilityText}>{availability}</Text>
          </View>
        </View>

        <Text style={styles.statusMessage}>{statusMessage}</Text>
      </View>
    </View>
  );
}

function getAvailabilityStyle(state: Props["availability"]) {
  switch (state) {
    case "Online":
      return { backgroundColor: "#3CB371" };
    case "Away":
      return { backgroundColor: "#DAA520" };
    case "Offline":
      return { backgroundColor: "#555" };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: surfaceColor,
    borderBottomWidth: 1,
    borderBottomColor: overlayColor,
    gap: 12,
    alignItems: "center",
  },

  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: overlayColor,
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },

  availabilityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  statusMessage: {
    marginTop: 4,
    color: textColor,
    fontSize: 14,
  },
});
