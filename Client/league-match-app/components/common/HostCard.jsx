import * as Clipboard from "expo-clipboard";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./Styles/HostCardStyle";

export default function HostCard({ host, isLobby, status }) {
  // Determine outline only when in lobby
  let borderColor = "transparent";
  let borderWidth = 0;
  // console.log(host.riotId)

  if (isLobby) {
    borderWidth = 2;
    borderColor = status ? "#00C851" : "#ff4444"; // green or red
  }

  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity
        style={[styles.hostCardButtonStyle, { borderColor, borderWidth }]}
        disabled={!isLobby} // optional: host card not interactive outside lobby
        onLongPress={async () => {
          if (!host?.riotId) return;
          await Clipboard.setStringAsync(host.riotId);
          Toast.show({
            type: "success",
            text1: "Copied Riot ID to clipboard: ",
            text2: host.riotId,
            position: "center",
            topOffset: 55,
          });
        }}
      >
        {host ? (
          <>
            <Text style={styles.text}>Host: {host.riotId}</Text>
            <Text style={styles.text}>Role: {host.position}</Text>
            <Text style={styles.text}>Champion: {host.championId}</Text>
            {/* {isLobby && (
              <Text style={styles.text}>
                Ready: {status ? "True" : "False"}
              </Text>
            )} */}
          </>
        ) : (
          <Text style={styles.text}>Loading Host...</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
