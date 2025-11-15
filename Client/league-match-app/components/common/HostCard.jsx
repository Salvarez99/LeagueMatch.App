import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Styles/HostCardStyle";

export default function HostCard({ style, buttonStyle, textStyle, host }) {
  return (
    <View style={[styles.containerStyle, style]}>
      <TouchableOpacity style={[styles.hostCardButtonStyle, buttonStyle]}>
        {host ? (
          <>
            <Text style={[styles.text, textStyle]}>Host: {host.uid}</Text>
            <Text style={[styles.text, textStyle]}>Role: {host.position}</Text>
            <Text style={[styles.text, textStyle]}>Champion: {host.championId}</Text>
          </>
        ) : (
          <Text style={[styles.text, textStyle]}>Loading Host...</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}