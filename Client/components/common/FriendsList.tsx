import { useState, useEffect, useRef, useMemo } from "react";
import { View, FlatList, StyleSheet, Keyboard } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import ListItem from "./ListItem";
import { surfaceColor, overlayColor, textColor } from "@/utils/colors";

interface Friend {
  username: string;
  availability: "Online" | "Away" | "Offline";
  statusMessage: string;
}

interface Props {
  data: Friend[];
  onSelect?: (friend: Friend) => void;
  autoFocus?: boolean;
}

export default function FriendsList({
  data,
  onSelect,
  autoFocus = false,
}: Props) {
  const [search, setSearch] = useState("");

  const inputRef =
    useRef<React.ComponentRef<typeof BottomSheetTextInput>>(null);

  // Focus input only when this screen becomes active
  useEffect(() => {
    if (!autoFocus) return;

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 200); // aligns with bottom sheet open animation

    return () => clearTimeout(timeout);
  }, [autoFocus]);

  // Derived filtered list (no extra state needed)
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return data;

    return data.filter((item) => item.username.toLowerCase().includes(query));
  }, [search, data]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <BottomSheetTextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={textColor}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* Friends List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <ListItem
            username={item.username}
            availability={item.availability}
            statusMessage={item.statusMessage}
            onPress={() => {
              Keyboard.dismiss();
              onSelect?.(item);
            }}
          />
        )}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaceColor,
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: overlayColor,
  },

  searchInput: {
    backgroundColor: overlayColor,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
  },
});
