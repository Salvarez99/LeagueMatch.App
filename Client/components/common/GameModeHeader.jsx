import { Text, View } from "react-native";
import { styles } from "./Styles/GameModeHeaderStyle";

export default function GameModeHeader({ gameMap, gameMode }) {
  return (
    <View style={styles.conatinerStyle}>
      <View style={styles.gameDetailsContainer}>
        <Text style={styles.gameMapStyle}>
          {gameMap === "" ? "Summoner's Rift" : gameMap}
        </Text>
        <Text style={styles.gameModeStyle}>
          {gameMap === "Aram" ? "Howling Abyss" : gameMode}
        </Text>
      </View>
      <View style={styles.gameIconStyle}></View>
    </View>
  );
}
