import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles/DiscordButtonStyle";

interface DiscordButtonProps {
  style: any;
  isHost: boolean;
  discordLink: string | null | undefined;
  onUpdateLink: (link: string) => void;
}

export default function DiscordButton({
  style,
  isHost,
  discordLink,
  onUpdateLink,
}: DiscordButtonProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [linkInput, setLinkInput] = useState<string>(discordLink || "");

  const handlePress = async () => {
    if (isHost) {
      setModalVisible(true);
      return;
    }

    if (!discordLink) return;

    try {
      // 1️⃣ Convert to app URL if possible
      const inviteCode = discordLink.split("discord.gg/")[1];
      const appUrl = inviteCode
        ? `discord://discord.gg/${inviteCode}`
        : discordLink;

      // 2️⃣ Try opening in Discord app
      const canOpenApp = await Linking.canOpenURL(appUrl);

      if (canOpenApp) {
        await Linking.openURL(appUrl);
      } else {
        // 3️⃣ Fall back to browser
        await Linking.openURL(discordLink);
      }
    } catch (err) {
      console.error("Error opening Discord link:", err);
    }
  };

  const isInactive = !discordLink && !isHost;

  return (
    <View style={[styles.discordContainer, style]}>
      <TouchableOpacity
        style={[
          styles.discordButton,
          !discordLink && !isHost && { opacity: 0.5 },
        ]}
        disabled={isInactive}
        onPress={handlePress}
      >
        <LinearGradient
          colors={
            discordLink
              ? ["rgba(88,101,242,1)", "rgba(224,227,255,1)"]
              : ["#aaa", "#ccc"] // grey gradient if no link
          }
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: -1 }}
          style={styles.button}
        >
          <Image
            source={require("./../../assets/images/Discord-Logo/Discord-Logo/Logo_RGB/Discord-Logo-White.png")}
            style={{ width: 120, height: 25, resizeMode: "contain" }}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal for host link input */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Discord Link</Text>
            <TextInput
              placeholder="https://discord.gg/example"
              value={linkInput}
              onChangeText={setLinkInput}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  onUpdateLink(linkInput); // pass link up to parent
                }}
              >
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
