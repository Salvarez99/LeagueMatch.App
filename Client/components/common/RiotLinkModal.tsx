import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/authContext";
import { userApi } from "../../utils/api/userApi";
import { getApiErrorMessage } from "../../utils/api/axiosClient";
import { styles } from "./Styles/RiotLinkModalStyle";

interface RiotLinkModalProps {
  visible: boolean;
  onClose: (open: boolean) => void;
}

export default function RiotLinkModal({
  visible,
  onClose,
}: RiotLinkModalProps) {
  const { authUser } = useAuth();
  const [riotID, setRiotID] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");

  const handleCancel = () => {
    onClose(false);
  };

  const handleLink = async () => {
    if (!riotID || !tagLine) {
      Alert.alert("Please enter both Riot ID and Tagline.");
      return;
    }
    if (!authUser) {
      Alert.alert(
        "Sign-in required",
        "Please sign in before linking your Riot ID.",
      );
      return;
    }

    const fullRiotID = `${riotID.trim()}#${tagLine.replace(/^#+/, "").trim()}`;

    try {
      await userApi.updateUser({
        riotId: fullRiotID,
      });
      onClose(false);
    } catch (err) {
      Alert.alert(
        "Unable to link Riot ID",
        getApiErrorMessage(err, "The Riot account could not be linked."),
      );
    }
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Link your Riot ID</Text>
          <Text style={styles.description}>
            Riot ID is needed for matchmaking features
          </Text>

          <View style={styles.combinedInputContainer}>
            <View style={styles.inputGroupID}>
              <Text style={styles.label}>Riot ID</Text>
              <TextInput
                placeholder="Riot ID"
                style={styles.input}
                placeholderTextColor="#888"
                maxLength={16}
                onChangeText={setRiotID}
              />
            </View>

            <View style={styles.inputGroupTag}>
              <Text style={styles.label}>Tagline</Text>
              <TextInput
                placeholder="#000"
                style={styles.input}
                placeholderTextColor="#888"
                maxLength={5}
                onChangeText={setTagLine}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.laterButton} onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.riotButton} onPress={handleLink}>
              <Text>Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
