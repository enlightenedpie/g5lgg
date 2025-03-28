import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMachine } from "@xstate/react";
import { g5lggMachine } from "@/machines/g5lggMachine";
import { ThemedView } from "@/components/ThemedView";
import { EmbeddedKeyboard } from "@/components/EmbeddedKeyboard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { G5LGGRow } from "@/components/GameRow";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

const numOfRows = 6;

export default function GameBoard() {
  const backgroundColor = useThemeColor({}, "background");
  const [state, send] = useMachine(g5lggMachine);
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const rowsRemaining = useMemo(
    () => numOfRows - state.context.guesses.length,
    [state.context.guessNumber]
  );

  const _setter = (text: string) => {
    const actionMap: { [key: string]: () => void } = {
      Back: () =>
        send({
          type: "BACK",
        }),
      Enter: () => {
        send({
          type: "ENTER",
        });
      },
      default: () =>
        send({
          type: "UPDATE",
          value: text,
        }),
    };

    actionMap[text] ? actionMap[text]() : actionMap.default();
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={[{ backgroundColor }, styles.mainContainer]}>
      <ThemedView style={styles.topContainer}>
        <Image
          source={require("@/assets/images/g5lgg-logo.png")}
          style={styles.g5lggLogo}
          resizeMode="center"
        />
      </ThemedView>
      <ThemedView style={styles.gridContainer}>
        {state.context.guesses.map((guess, index) => (
          <G5LGGRow
            key={`g5lgg-row-${index}`}
            guess={guess}
            validate={state.context.shouldValidate[index]}
            quick={state.matches({
              loaded: "gameover",
            })}
          />
        ))}
        {rowsRemaining > 0 && (
          <>
            <G5LGGRow guess={state.context.currentGuess.join("")} isActive />
            {Array.from({ length: rowsRemaining - 1 }, (_, i) => (
              <G5LGGRow key={`g5lgg-rowRem${i}`} guess="" />
            ))}
          </>
        )}
      </ThemedView>
      <EmbeddedKeyboard onKeyPress={_setter} />
    </SafeAreaView>
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
  gridContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: width / 24,
    alignItems: "center",
    width: width,
    height: "60%",
  },
  topContainer: {
    height: height / 10,
  },
  g5lggLogo: {
    width: "100%",
    height: height / 10,
  },
});
