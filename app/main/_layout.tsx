import React from "react";
import { Image, StyleSheet, Platform, Button } from "react-native";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [state, send] = useMachine(g5lggMachine);
  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText>{JSON.stringify(state.value)}</ThemedText>
      <Button
        title="Guess"
        onPress={() =>
          send({
            type: "GUESS",
          })
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
