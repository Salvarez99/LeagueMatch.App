import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RiotLinkModal from "../../components/common/RiotLinkModal";
import { styles } from "./indexStyle";

export default function Index() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkLater = () => {
    router.push("/menu/menu");
  };

  const handleLink = () => {
    router.push("/menu/menu");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Link your Riot ID</Text>

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
        <TouchableOpacity style={styles.laterButton} onPress={handleLinkLater}>
          <Text>Link later</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.riotButton} onPress={handleLink}>
          <Text>Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.riotButton}
          onPress={() => setIsOpen(true)}
        >
          <Text>open modal</Text>
        </TouchableOpacity>
        <RiotLinkModal visible={isOpen} onClose={() => setIsOpen(false)} />
      </View>
    </SafeAreaView>
  );
}
