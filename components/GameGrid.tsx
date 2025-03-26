import React from "react";
import { useMemo } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");
const CELL_SIZE = width / 5 - 24;
const LETTER_SIZE = CELL_SIZE - 16;

export const G5LGGGrid: React.FC = () => {
  const [state] = useMachine(g5lggMachine);
  const gameBoard = useMemo(
    () =>
      Array.from({ length: 6 }, (_, ind) => {
        const isCurrentRow = ind === state.context.guessNumber;
        const rowWord = state.context.guesses[ind] || "     ";
        return (
          <ThemedView style={styles.row}>
            {Array.from({ length: 5 }, (_, i) => {
              const currLtr = rowWord[i];
              const isExact = state.context.word?.indexOf(currLtr) === i;
              const isExists = state.context.word?.includes(currLtr);

              return (
                <ThemedView
                  style={[
                    styles.cell,
                    isExists && styles.bgExists,
                    isExact && styles.bgExact,
                  ]}
                >
                  <Text style={styles.cellText}>
                    {(currLtr || state.context.currentGuess[i]).toUpperCase()}
                  </Text>
                </ThemedView>
              );
            })}
          </ThemedView>
        );
      }),
    [state.context]
  );
  return gameBoard;
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
    borderColor: "#eeeeee50",
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
