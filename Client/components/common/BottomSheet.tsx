import {
  Animated,
  Pressable,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  PanResponder,
} from "react-native";
import { useState, useRef, useEffect, JSX } from "react";
import Screen from "@/utils/dimensions";

type RenderFn = (props: {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
}) => JSX.Element;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: string;
  height?: number;
  renders: Record<string, RenderFn>;
}

export default function BottomSheet({
  isOpen,
  onClose,
  renders,
  initial = "base",
  height = Screen.height * 0.45,
}: BottomSheetProps) {
  /**
   * currentRender, setCurrentRender = useState(baseRender)
   * selected, setSelected = useState("base") // pass in setSelected to "base" render in map so
   * when option is clicked will set to another string and then render that function if in map
   *
   */
  const translateY = useRef(new Animated.Value(height)).current;
  const [selected, setSelected] = useState<string>(initial);
  const CurrentRender = renders[selected];

  // Drag gesture to close sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) =>
        gesture.dy > 0 && translateY.setValue(gesture.dy),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Reset selected render when closing
  useEffect(() => {
    if (!isOpen) setSelected(initial);
  }, [isOpen]);

  // Opening/closing animation
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <>
      {/**Background transparent overlay */}
      {isOpen && (
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View />
        </Pressable>
      )}

      {/**Bottomsheet container */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { height, transform: [{ translateY }] }]}
      >
        {/**Header Container*/}
        <View style={styles.header}>
          {/**Handble bar */}
          <View style={styles.handle} />

          {/**Back Icon conditional*/}
          {selected !== initial && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelected(initial)}
            >
              <Text style={styles.headerText}> Back </Text>
            </TouchableOpacity>
          )}

          {/*Header Title*/}
          <Text>{selected}</Text>

          {/*Close Icon*/}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.headerText}> X </Text>
          </TouchableOpacity>
        </View>

        {/**Content container */}
        <View style={styles.content}>
          {/**Conditionally render content if selected is in the renders map */}
          {/** {selected in renders && renders[selected]} */}
          {CurrentRender && (
            <CurrentRender setSelected={setSelected} selected={selected} />
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  handle: {
    width: 55,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 3,
    marginBottom: 8,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 8,
  },
  headerText: {
    color: "white",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
