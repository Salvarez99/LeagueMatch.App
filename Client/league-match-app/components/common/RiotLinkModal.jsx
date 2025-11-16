import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from "react-native";
import { useAuth } from "../../context/authContext";
import { userApi } from "../../utils/api/userApi";
import { styles } from "./Styles/RiotLinkModalStyle";

export default function RiotLinkModal({ visible, onClose }) {
  const { user, loading } = useAuth();
  const [riotID, setRiotID] = useState("");
  const [tagLine, setTagLine] = useState("");

  const handleCancel = () => {
    onClose(false);
  };

  const handleLink = async () => {
    const fullRiotID = `${riotID}#${tagLine}`;
    const uid = user?.uid;
    if (!riotID || !tagLine) {
      Alert.alert("Please enter both Riot ID and Tagline.");
      return;
    }

    try {
      await userApi.updateUser({
        uid: uid,
        riotId: fullRiotID,
      });
      onClose(false);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      // statusBarTranslucent={true}
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
