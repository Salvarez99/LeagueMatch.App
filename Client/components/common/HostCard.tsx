import { champions } from "@/utils/constants";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import PickChampionModal from "../preLobby/PickChampionModal";
import { styles } from "./Styles/HostCardStyle";
import { ILobbyPlayer } from "@leaguematch/shared";

interface HostCardProps {
  style?: any;
  host: ILobbyPlayer | null;
  isLobby: boolean;
  status?: boolean;
  currentUid: string;
  onChampionSelect?: (uid: string, championId: string) => void;
}

export default function HostCard({
  host,
  isLobby,
  status,
  currentUid,
  onChampionSelect,
}: HostCardProps) {
  if (!host) {
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.text}>Loading Host...</Text>
      </View>
    );
  }

  let borderColor = "transparent";
  let borderWidth = 0;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [championId, setChampionId] = useState<string>(host.championId || "");
  const [championName, setChampionName] = useState<string>(
    champions[championId] || ""
  );

  if (isLobby) {
    borderWidth = 2;
    borderColor = status ? "#00C851" : "#ff4444";
  }

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={[styles.hostCardButtonStyle, { borderColor, borderWidth }]}
        // do NOT disable the button
        onPress={() => {
          if (currentUid !== host.uid) return; // ⛔ tap does nothing for non-host
          setIsOpen(true); // ✅ only host can open
        }}
        onLongPress={async () => {
          // Long press should still work for everyone
          await Clipboard.setStringAsync(host.riotId);
          Toast.show({
            type: "success",
            text1: "Copied Riot ID",
            text2: host.riotId,
          });
        }}
        delayLongPress={250}
      >
        <Text style={styles.text}>Host: {host.riotId}</Text>
        <Text style={styles.text}>Role: {host.position}</Text>
        <Text style={styles.text}>Champion: {host.championId}</Text>

        <PickChampionModal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          setChampionId={(id: string) => {
            setChampionId(id);
            onChampionSelect?.(host.uid, id);
          }}
          setChampionName={setChampionName}
        />
      </TouchableOpacity>
    </View>
  );
}
