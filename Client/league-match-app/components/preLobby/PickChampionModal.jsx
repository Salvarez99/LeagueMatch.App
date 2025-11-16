import { useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { champions, roles } from "../../utils/constants";
import { styles } from "./styles/PickChampionModalStyle";

export default function PickChampionModal({ visible, onClose, setChampionId, setChampionName }) {
  const [query, setQuery] = useState("");
  const [selectedChamp, setSelectedChamp] = useState("");
  const getChampionIconUrl = (name) =>
    `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${name}.png`;

  const ChampIcon = ({ id, name }) => (
    <TouchableOpacity
      style={styles.champButton}
      onPress={() => {
        // console.log(id);
        setSelectedChamp(id);
        setChampionId(id);
        setChampionName(name);
        onClose();
      }}
    >
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
    <TouchableOpacity style={styles.roleButton}>
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
              <View style={styles.roleButtonContainer}>
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
                contentContainerStyle={styles.contentContainerStyle}
                ListEmptyComponent={
                  <Text style={styles.listEmptyStyle}>No champions found</Text>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
