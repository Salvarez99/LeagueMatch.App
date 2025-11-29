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
import { champions, championList, roles } from "../../utils/constants";
import { styles } from "./styles/PickChampionModalStyle";

interface PickChampionModalProps {
  visible: boolean;
  onClose: () => void;
  setChampionId: (id: string) => void;
  setChampionName: (name: string) => void;
}

interface ChampIconProps {
  id: string;
  name: string;
}

interface RoleButtonProps {
  role: string;
}

export default function PickChampionModal({
  visible,
  onClose,
  setChampionId,
  setChampionName,
}: PickChampionModalProps) {
  const [query, setQuery] = useState("");
  const [selectedChamp, setSelectedChamp] = useState("");

  const getChampionIconUrl = (id: string) =>
    `https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${id}.png`;

  const ChampIcon = ({ id, name }: ChampIconProps) => (
    <TouchableOpacity
      style={styles.champButton}
      onPress={() => {
        setSelectedChamp(id);
        setChampionId(id);
        setChampionName(name);
        onClose();
      }}
    >
      <Image source={{ uri: getChampionIconUrl(id) }} style={styles.champIcon} />
      <Text style={styles.champName}>{name}</Text>
    </TouchableOpacity>
  );

  const RoleButton = ({ role }: RoleButtonProps) => (
    <TouchableOpacity style={styles.roleButton}>
      <Text>{role}</Text>
    </TouchableOpacity>
  );

  const queryChampions = (search: string) => {
    if (!search.trim()) return championList;
    const q = search.toLowerCase().trim();
    return championList.filter((champ) => champ.id.toLowerCase().includes(q));
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose();
          return true;
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
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdown}>
              <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Search..."
              />

              <View style={styles.roleButtonContainer}>
                {roles.map((role) => (
                  <RoleButton key={role} role={role} />
                ))}
              </View>

              <FlatList
                data={queryChampions(query)}
                keyExtractor={(item) => item.id}
                numColumns={4}
                renderItem={({ item }) => (
                  <ChampIcon id={item.id} name={item.name} />
                )}
                persistentScrollbar
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
