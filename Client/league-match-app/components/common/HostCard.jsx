import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Styles/HostCardStyle";

export default function HostCard({ style, buttonStyle, textStyle }) {
  return (
    <View style={[styles.containerStyle, style]}>
      <TouchableOpacity style={[styles.hostCardButtonStyle, buttonStyle]}>
        <Text style={[styles.text, textStyle]}>Host Card</Text>
      </TouchableOpacity>
    </View>
  );
}
