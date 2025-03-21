import "react-native-reanimated";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");
const CELL_SIZE = width / 5 - 24;
const LETTER_SIZE = CELL_SIZE - 16;

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const [currentGuess, setCurrentGuess] = useState("");
  const [state, send] = useMachine(g5lggMachine);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const gameBoard = useMemo(
    () =>
      Array.from({ length: 6 }, (_, ind) => {
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
                  <Text style={styles.cellText}>{(currLtr || currentGuess[i]).toUpperCase()}</Text>
                </ThemedView>
              );
            })}
          </ThemedView>
        );
      }),
    [state.context, currentGuess]
  );

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <SafeAreaView style={[{ backgroundColor }, styles.mainContainer]}>
        <ThemedView style={[styles.borderContainer]}>
          <Text>Whassup</Text>
        </ThemedView>
        <ThemedView style={[styles.topContainer]}>{gameBoard}</ThemedView>
        <ThemedView style={styles.borderContainer}>
          <Button
            title="Guess"
            onPress={() =>
              send({
                type: "GUESS",
                value: "bling",
              })
            }
          />
        </ThemedView>
        <ThemedText>{JSON.stringify(state)}</ThemedText>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  borderContainer: {
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
  },
  topContainer: {
    padding: 24,
    height: width + 24,
  },
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
