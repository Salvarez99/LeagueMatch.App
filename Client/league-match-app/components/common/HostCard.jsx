import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Styles/HostCardStyle";

export default function HostCard({ host }) {
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity style={styles.hostCardButtonStyle}>
        {host ? (
          <>
            <Text style={styles.text}>Host: {host.uid}</Text>
            <Text style={styles.text}>Role: {host.position}</Text>
            <Text style={styles.text}>Champion: {host.championId}</Text>
          </>
        ) : (
          <Text style={styles.text}>Loading Host...</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
