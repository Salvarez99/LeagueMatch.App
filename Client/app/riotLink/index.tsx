import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";
import { userApi } from "@/utils/api/userApi";
import { styles } from "@/styles/riotLinkStyle";

export default function Index() {
  const { user, authLoading } = useAuth();
  const [riotID, setRiotID] = useState("");
  const [tagLine, setTagLine] = useState("");

  const handleLinkLater = () => {
    router.push("/menu/menu");
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
      router.push("/menu/menu");
    } catch (err) {
      console.log(err);
    } finally {
    }
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
        <TouchableOpacity style={styles.laterButton} onPress={handleLinkLater}>
          <Text>Link later</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.riotButton} onPress={handleLink}>
          <Text>Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
