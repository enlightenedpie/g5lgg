import { Alert } from "react-native";
import { assign, fromPromise, setup } from "xstate";
import { useDictionary } from "@/hooks";

const context = {
  error: "",
  word: "",
  guessNumber: 0,
  guesses: [],
};

export const g5lggMachine = setup({
  types: {
    context: {} as {
      error: string;
      word: string | null;
      guessNumber: number;
      guesses: string[];
    },
  },
  actors: {
    fetchWord: fromPromise(({ input }: { input: { word: string | null } }) =>
      useDictionary()
    ),
  },
  actions: {
    nextGuess: assign({
      guessNumber: ({ context }) => context.guessNumber + 1,
      guesses: ({ context, event }) => {
        const __guessesTmp = [...context.guesses];
        __guessesTmp[context.guessNumber] = event.value;
        return __guessesTmp;
      },
    }),
  },
  guards: {
    checkWord: ({ context }) => {
      return context.word === context.guesses[context.guessNumber - 1];
    },
    checkAllGuesses: ({ context }) => {
      return (
        context.guessNumber === 6 &&
        context.word !== context.guesses[context.guessNumber - 1]
      );
    },
    isValidMove: ({ context, event }) => {
      const theGuess = event.value;
      let _msg = (message: string) =>
        Alert.alert("Invalid Guess", message, [
          {
            text: "Ok",
          },
        ]);

      if (theGuess.length !== 5) {
        _msg("Your guess must be 5 letters");
        return false;
      }

      if (context.guesses.includes(theGuess)) {
        _msg("You've already guessed that word");
        return false;
      }

      return event.value.length === 5;
    },
  },
}).createMachine({
  id: "g5lgg",
  initial: "Loading",
  context,
  states: {
    Loading: {
      invoke: {
        src: "fetchWord",
        input: ({ context }) => ({ word: context.word }),
        onDone: {
          target: "Loaded",
          actions: assign({
            word: ({ event }) => event.output?.word || "",
          }),
        },
        onError: "Failed",
      },
    },
    Loaded: {
      initial: "Play",
      states: {
        Play: {
          always: [
            { target: "GameOver.Solved", guard: "checkWord" },
            { target: "GameOver.Unsolved", guard: "checkAllGuesses" },
          ],
          on: {
            GUESS: [
              {
                target: "Play",
                guard: "isValidMove",
                actions: {
                  type: "nextGuess",
                },
              },
            ],
          },
        },
        GameOver: {
          initial: "Unsolved",
          states: {
            Solved: {},
            Unsolved: {},
          },
        },
      },
    },
    Failed: {},
  },
});
