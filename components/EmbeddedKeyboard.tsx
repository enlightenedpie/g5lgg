import React from "react";
import { Dimensions, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView, AnimatedThemedView } from "@/components/ThemedView";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface EmbeddedKeyboardProps {
  onKeyPress?: (key: string) => void;
}

const { width } = Dimensions.get("window");

const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Back"],
];

export const EmbeddedKeyboard: React.FC<EmbeddedKeyboardProps> = ({
  onKeyPress,
}) => {
  return (
    <ThemedView style={styles.keyboardContainer}>
      {keys.map((row, i) => (
        <ThemedView key={i} style={styles.keyboardRow}>
          {row.map((key, j) => {
            const _onKeyPress = () => {
              onKeyPress && onKeyPress(key);
            };
            const scale = useSharedValue(1);
            const vert = useSharedValue(0);

            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: scale.value }, { translateY: vert.value }],
              };
            });

            const _handlePressIn = () => {
              scale.value = withTiming(1.5, {
                duration: 100,
                easing,
              });

              vert.value = withTiming(-8, {
                duration: 100,
                easing,
              });
            };

            const _handlePressOut = () => {
              scale.value = withTiming(1, {
                duration: 100,
                easing,
              });

              vert.value = withTiming(0, {
                duration: 100,
                easing,
              });
            };
            return (
              <Pressable
                onPress={_onKeyPress}
                onPressIn={_handlePressIn}
                onPressOut={_handlePressOut}
                key={`${key}-${j}`}
              >
                <AnimatedThemedView style={[styles.key, animatedStyle]}>
                  <ThemedText
                    style={[
                      styles.keyText,
                      (key === "Enter" || key === "Back") && styles.fatKeyText,
                    ]}
                  >
                    {key}
                  </ThemedText>
                </AnimatedThemedView>
              </Pressable>
            );
          })}
        </ThemedView>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    height: "30%",
    paddingHorizontal: 4,
    paddingTop: (width - 88) / 10,
  },
  keyboardRow: {
    width: "100%",
    gap: 6,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  key: {
    minWidth: (width - 88) / 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#666",
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  keyText: { fontWeight: "bold", fontSize: 16 },
  fatKeyText: { fontSize: 14 },
});
