import { router } from "expo-router";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./Styles/RiotLinkModalStyle";

export default function RiotLinkModal({ visible, onClose }) {
  const handleCancel = () => {
    onClose(false);
  };

  const handleLink = () => {
    router.push("/menu/menu");
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
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
              />
            </View>

            <View style={styles.inputGroupTag}>
              <Text style={styles.label}>Tagline</Text>
              <TextInput
                placeholder="#000"
                style={styles.input}
                placeholderTextColor="#888"
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
