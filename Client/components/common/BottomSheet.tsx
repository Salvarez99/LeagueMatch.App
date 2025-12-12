import {
  Animated,
  Pressable,
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Keyboard,
  Platform,
} from "react-native";
import { useState, useRef, useEffect, JSX } from "react";
import Screen from "@/utils/dimensions";
import { Ionicons } from "@expo/vector-icons";

type RenderFn = (props: {
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
  registerScrollable?: (ref: any) => void;
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
  const sheetTranslateY = useRef(new Animated.Value(height)).current;
  const keyboardShift = useRef(new Animated.Value(0)).current;

  const [selected, setSelected] = useState<string>(initial);
  const CurrentRender = renders[selected];

  const scrollOffset = useRef(0);
  const scrollRef = useRef<any>(null);

  // Allow children to register FlatList/ScrollView
  const registerScrollable = (ref: any) => {
    scrollRef.current = ref;
  };

  // -------------------------------------------
  // KEYBOARD LISTENERS (WORKS ON IOS + ANDROID)
  // -------------------------------------------
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(keyboardShift, {
        toValue: e.endCoordinates.height - 40, // adjust
        duration: 220,
        useNativeDriver: false,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardShift, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // -------------------------------------------
  // DRAG HANDLER — ONLY WHEN SCROLLTOP = 0
  // -------------------------------------------
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only allow drag if user is dragging DOWN and scroll is at top
        return gesture.dy > 5 && scrollOffset.current <= 0;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          sheetTranslateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          onClose();
        } else {
          Animated.timing(sheetTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // -------------------------------------------
  // OPEN / CLOSE ANIMATION
  // -------------------------------------------
  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: isOpen ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!isOpen) {
      setSelected(initial);
    }
  }, [isOpen]);

  // Listen scroll offset from children lists
  const onScroll = (y: number) => {
    scrollOffset.current = y;
  };

  return (
    <>
      {isOpen && (
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View />
        </Pressable>
      )}

      <Animated.View
        style={[
          styles.sheet,
          {
            height,
            transform: [
              { translateY: sheetTranslateY },
              { translateY: Animated.multiply(keyboardShift, -1) },
            ],
          },
        ]}
      >
        {/** HEADER BAR */}
        <View style={styles.header} {...panResponder.panHandlers}>
          <View style={styles.handle} />

          {selected !== initial && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelected(initial)}
            >
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={26} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {CurrentRender && (
            <CurrentRender
              setSelected={setSelected}
              selected={selected}
              registerScrollable={registerScrollable}
              onScroll={onScroll}
            />
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
  },
});
