import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import {
  withDelay,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
  Easing,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedView, AnimatedThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");
const CELL_SIZE = width / 5 - 24;
const LETTER_SIZE = CELL_SIZE - 16;
const rowLength = 5;
const easing = Easing.bezier(0.25, 0.1, 0.25, 1);

interface G5LGGRowProps {
  guess: string;
  validate?: boolean;
  quick?: boolean;
  isActive?: boolean;
}

export const G5LGGRow: React.FC<G5LGGRowProps> = ({
  guess,
  validate = false,
  quick = false,
  isActive = false,
}) => {
  const guessArr = Array.from({ length: rowLength }, (_, i) => guess[i] || " ");
  const [state] = useMachine(g5lggMachine);

  return (
    <ThemedView style={styles.row}>
      {guessArr.map((ltr, i) => {
        const progress = useSharedValue(0);

        const isExact = state.context.word?.indexOf(ltr) === i;
        const isExists =
          state.context.word?.includes(ltr) &&
          state.context.word?.indexOf(ltr, i) > i;

        const _color = isExact
          ? "#008000"
          : isExists
          ? "#c3a900"
          : "transparent";

        const animatedStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: interpolateColor(
              progress.value,
              [0, 1],
              ["transparent", _color]
            ),
          };
        });

        useEffect(() => {
          if (validate) {
            progress.value = withDelay(
              (quick ? 0 : 500) * i,
              withTiming(1, {
                duration: quick ? 250 : 1000,
                easing,
              })
            );
          }
        }, [validate, quick]);

        return (
          <AnimatedThemedView
            key={`anim-cell-${i}`}
            style={[styles.cell, {
              borderColor: isActive ? "#eeeeee" : "#eeeeee50",
            }, animatedStyle]}
          >
            <Text style={styles.cellText}>{ltr.toUpperCase()}</Text>
          </AnimatedThemedView>
        );
      })}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 10,
  },
  cell: {
    padding: 0,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: "#eee",
    fontSize: LETTER_SIZE,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  bgExists: {
    backgroundColor: "#c3a900",
  },
  bgExact: {
    backgroundColor: "#008000",
  },
});
