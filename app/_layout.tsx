import "react-native-reanimated";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Button } from "react-native";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDictionary } from "@/hooks";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [state, send] = useMachine(g5lggMachine);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const stuff = useDictionary();

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
      <ThemedView style={styles.mainContainer}>
        <ThemedView style={styles.borderContainer}>
          {state.context.guesses.map((gss) => (
            <ThemedText>{gss}</ThemedText>
          ))}
        </ThemedView>
        <ThemedView style={styles.borderContainer}>
          <ThemedText>{JSON.stringify(state)}</ThemedText>
          <Button
            title="Guess"
            onPress={() =>
              send({
                type: "GUESS",
                value: "hello",
              })
            }
          />
        </ThemedView>
      </ThemedView>
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
});
