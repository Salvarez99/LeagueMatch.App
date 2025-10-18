import { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  BackHandler
} from "react-native";
import Screen from "../utils/dimensions";

export default function PickChampionModal({ visible, onClose }) {
  const [query, setQuery] = useState("");
  const getChampionIconUrl = (name) =>
    `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${name}.png`;

  const champions = [
    { id: "Aatrox", name: "Aatrox" },
    { id: "Ahri", name: "Ahri" },
    { id: "Akali", name: "Akali" },
    { id: "Akshan", name: "Akshan" },
    { id: "Alistar", name: "Alistar" },
    { id: "Ambessa", name: "Ambessa" },
    { id: "Amumu", name: "Amumu" },
    { id: "Anivia", name: "Anivia" },
    { id: "Annie", name: "Annie" },
    { id: "Aphelios", name: "Aphelios" },
    { id: "Ashe", name: "Ashe" },
    { id: "AurelionSol", name: "Aurelion Sol" },
    { id: "Aurora", name: "Aurora" },
    { id: "Azir", name: "Azir" },
    { id: "Bard", name: "Bard" },
    { id: "Belveth", name: "Bel'Veth" },
    { id: "Blitzcrank", name: "Blitzcrank" },
    { id: "Brand", name: "Brand" },
    { id: "Braum", name: "Braum" },
    { id: "Briar", name: "Briar" },
    { id: "Caitlyn", name: "Caitlyn" },
    { id: "Camille", name: "Camille" },
    { id: "Cassiopeia", name: "Cassiopeia" },
    { id: "Chogath", name: "Cho'Gath" },
    { id: "Corki", name: "Corki" },
    { id: "Darius", name: "Darius" },
    { id: "Diana", name: "Diana" },
    { id: "Draven", name: "Draven" },
    { id: "DrMundo", name: "Dr. Mundo" },
    { id: "Ekko", name: "Ekko" },
    { id: "Elise", name: "Elise" },
    { id: "Evelynn", name: "Evelynn" },
    { id: "Ezreal", name: "Ezreal" },
    { id: "Fiddlesticks", name: "Fiddlesticks" },
    { id: "Fiora", name: "Fiora" },
    { id: "Fizz", name: "Fizz" },
    { id: "Galio", name: "Galio" },
    { id: "Gangplank", name: "Gangplank" },
    { id: "Garen", name: "Garen" },
    { id: "Gnar", name: "Gnar" },
    { id: "Gragas", name: "Gragas" },
    { id: "Graves", name: "Graves" },
    { id: "Gwen", name: "Gwen" },
    { id: "Hecarim", name: "Hecarim" },
    { id: "Heimerdinger", name: "Heimerdinger" },
    { id: "Hwei", name: "Hwei" },
    { id: "Illaoi", name: "Illaoi" },
    { id: "Irelia", name: "Irelia" },
    { id: "Ivern", name: "Ivern" },
    { id: "Janna", name: "Janna" },
    { id: "JarvanIV", name: "Jarvan IV" },
    { id: "Jax", name: "Jax" },
    { id: "Jayce", name: "Jayce" },
    { id: "Jhin", name: "Jhin" },
    { id: "Jinx", name: "Jinx" },
    { id: "Kaisa", name: "Kai'Sa" },
    { id: "Kalista", name: "Kalista" },
    { id: "Karma", name: "Karma" },
    { id: "Karthus", name: "Karthus" },
    { id: "Kassadin", name: "Kassadin" },
    { id: "Katarina", name: "Katarina" },
    { id: "Kayle", name: "Kayle" },
    { id: "Kayn", name: "Kayn" },
    { id: "Kennen", name: "Kennen" },
    { id: "Khazix", name: "Kha'Zix" },
    { id: "Kindred", name: "Kindred" },
    { id: "Kled", name: "Kled" },
    { id: "KogMaw", name: "Kog'Maw" },
    { id: "KSante", name: "K'Sante" },
    { id: "Leblanc", name: "LeBlanc" },
    { id: "LeeSin", name: "Lee Sin" },
    { id: "Leona", name: "Leona" },
    { id: "Lillia", name: "Lillia" },
    { id: "Lissandra", name: "Lissandra" },
    { id: "Lucian", name: "Lucian" },
    { id: "Lulu", name: "Lulu" },
    { id: "Lux", name: "Lux" },
    { id: "Malphite", name: "Malphite" },
    { id: "Malzahar", name: "Malzahar" },
    { id: "Maokai", name: "Maokai" },
    { id: "MasterYi", name: "Master Yi" },
    { id: "Mel", name: "Mel" },
    { id: "Milio", name: "Milio" },
    { id: "MissFortune", name: "Miss Fortune" },
    { id: "MonkeyKing", name: "Wukong" },
    { id: "Mordekaiser", name: "Mordekaiser" },
    { id: "Morgana", name: "Morgana" },
    { id: "Naafiri", name: "Naafiri" },
    { id: "Nami", name: "Nami" },
    { id: "Nasus", name: "Nasus" },
    { id: "Nautilus", name: "Nautilus" },
    { id: "Neeko", name: "Neeko" },
    { id: "Nidalee", name: "Nidalee" },
    { id: "Nilah", name: "Nilah" },
    { id: "Nocturne", name: "Nocturne" },
    { id: "Nunu", name: "Nunu & Willump" },
    { id: "Olaf", name: "Olaf" },
    { id: "Orianna", name: "Orianna" },
    { id: "Ornn", name: "Ornn" },
    { id: "Pantheon", name: "Pantheon" },
    { id: "Poppy", name: "Poppy" },
    { id: "Pyke", name: "Pyke" },
    { id: "Qiyana", name: "Qiyana" },
    { id: "Quinn", name: "Quinn" },
    { id: "Rakan", name: "Rakan" },
    { id: "Rammus", name: "Rammus" },
    { id: "RekSai", name: "Rek'Sai" },
    { id: "Rell", name: "Rell" },
    { id: "Renata", name: "Renata Glasc" },
    { id: "Renekton", name: "Renekton" },
    { id: "Rengar", name: "Rengar" },
    { id: "Riven", name: "Riven" },
    { id: "Rumble", name: "Rumble" },
    { id: "Ryze", name: "Ryze" },
    { id: "Samira", name: "Samira" },
    { id: "Sejuani", name: "Sejuani" },
    { id: "Senna", name: "Senna" },
    { id: "Seraphine", name: "Seraphine" },
    { id: "Sett", name: "Sett" },
    { id: "Shaco", name: "Shaco" },
    { id: "Shen", name: "Shen" },
    { id: "Shyvana", name: "Shyvana" },
    { id: "Singed", name: "Singed" },
    { id: "Sion", name: "Sion" },
    { id: "Sivir", name: "Sivir" },
    { id: "Skarner", name: "Skarner" },
    { id: "Smolder", name: "Smolder" },
    { id: "Sona", name: "Sona" },
    { id: "Soraka", name: "Soraka" },
    { id: "Swain", name: "Swain" },
    { id: "Sylas", name: "Sylas" },
    { id: "Syndra", name: "Syndra" },
    { id: "TahmKench", name: "Tahm Kench" },
    { id: "Taliyah", name: "Taliyah" },
    { id: "Talon", name: "Talon" },
    { id: "Taric", name: "Taric" },
    { id: "Teemo", name: "Teemo" },
    { id: "Thresh", name: "Thresh" },
    { id: "Tristana", name: "Tristana" },
    { id: "Trundle", name: "Trundle" },
    { id: "Tryndamere", name: "Tryndamere" },
    { id: "TwistedFate", name: "Twisted Fate" },
    { id: "Twitch", name: "Twitch" },
    { id: "Udyr", name: "Udyr" },
    { id: "Urgot", name: "Urgot" },
    { id: "Varus", name: "Varus" },
    { id: "Vayne", name: "Vayne" },
    { id: "Veigar", name: "Veigar" },
    { id: "Velkoz", name: "Vel'Koz" },
    { id: "Vex", name: "Vex" },
    { id: "Vi", name: "Vi" },
    { id: "Viego", name: "Viego" },
    { id: "Viktor", name: "Viktor" },
    { id: "Vladimir", name: "Vladimir" },
    { id: "Volibear", name: "Volibear" },
    { id: "Warwick", name: "Warwick" },
    { id: "Xayah", name: "Xayah" },
    { id: "Xerath", name: "Xerath" },
    { id: "XinZhao", name: "Xin Zhao" },
    { id: "Yasuo", name: "Yasuo" },
    { id: "Yone", name: "Yone" },
    { id: "Yorick", name: "Yorick" },
    { id: "Yunara", name: "Yunara" },
    { id: "Yuumi", name: "Yuumi" },
    { id: "Zac", name: "Zac" },
    { id: "Zed", name: "Zed" },
    { id: "Zeri", name: "Zeri" },
    { id: "Ziggs", name: "Ziggs" },
    { id: "Zilean", name: "Zilean" },
    { id: "Zoe", name: "Zoe" },
    { id: "Zyra", name: "Zyra" },
  ];

  const roles = ["Top", "Jg", "Mid", "Adc", "Sup"];
  const ChampIcon = ({ id, name }) => (
    <TouchableOpacity style={styles.champButton}>
      <Image
        source={{ uri: getChampionIconUrl(id) }}
        style={styles.champIcon}
      />
      <Text style={styles.champName}>{name}</Text>
    </TouchableOpacity>
  );

  const QueryChampions = (search) => {
    if (!search || search.trim() === "") return champions;
    const query = search.toLowerCase().trim();
    return champions.filter((champion) =>
      champion.id.toLowerCase().includes(query)
    );
  };

  const RoleButtons = ({ role }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: Screen.width * 0.115,
        height: Screen.height * 0.05,
        borderRadius: 8,
        backgroundColor: "#D9D9D9",
        elevation: 5,
      }}
    >
      <Text>{role}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose(); // tell parent to close modal
          return true; // prevent default
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      // style={{ flex: 1, position: "absolute", top: "20%", left: 0, right: 0 }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Dropdown */}
          <TouchableWithoutFeedback>
            <View style={[styles.dropdown]}>
              <TextInput
                style={styles.input}
                onChangeText={setQuery}
                value={query}
                placeholder="Search..."
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  //   marginTop: 10,
                  //   marginBottom: 0,
                  paddingTop: 10,
                  paddingBottom: 5,
                  //   backgroundColor: "green",
                }}
              >
                {roles.map((role) => (
                  <RoleButtons key={role} role={role} />
                ))}
              </View>
              <FlatList
                data={QueryChampions(query)}
                keyExtractor={(item) => item.id}
                numColumns={4}
                renderItem={({ item }) => (
                  <ChampIcon id={item.id} name={item.name} />
                )}
                persistentScrollbar={true}
                style={{ borderRadius: 15 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "flex-start",
                  //   borderRadius: 5,
                  //   backgroundColor: "red",
                }}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    No champions found
                  </Text>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    height: Screen.height * 0.7,
    padding: 10,
    paddingTop: 15,
    position: "absolute",
    top: "9%",
  },
  champButton: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  champIcon: {
    width: Screen.width * 0.18,
    height: Screen.width * 0.18,
    borderRadius: 8,
  },
  champName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
});
