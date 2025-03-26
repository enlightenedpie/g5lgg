import { Alert } from "react-native";
import { assign, fromPromise, setup } from "xstate";
import { useDictionary, getDictionary } from "@/hooks";

const blankGuess = Array.from({ length: 5 }, () => "");

const context = {
  type: "online" as const,
  word: "",
  guessNumber: 0,
  guesses: [],
  shouldValidate: [false, false, false, false, false],
  currentGuess: blankGuess,
  currentGuessIndex: 0,
};

const actors = {
  fetchWord: fromPromise(() => useDictionary()),
  isValidMove: fromPromise(
    async ({ input }: { input: { word: string; guesses: string[] } }) => {
      const wordArray = await getDictionary();
      const theGuess = input.word;

      let _msg = (message: string) =>
        Alert.alert("Invalid Guess", message, [
          {
            text: "Ok",
          },
        ]);

      if (theGuess.length !== 5) {
        _msg("Your guess must be 5 letters");
        throw false;
      }

      if (input.guesses.includes(theGuess)) {
        _msg("You've already guessed that word");
        throw false;
      }

      if (!wordArray.includes(theGuess)) {
        _msg("This is not a valid word, try again");
        throw false;
      }

      return true;
    }
  ),
};

export const g5lggMachine = setup({
  types: {
    context: {} as {
      type: "online" | "offline";
      word: string | null;
      guessNumber: number;
      guesses: string[];
      shouldValidate: boolean[];
      currentGuess: string[];
      currentGuessIndex: number;
    },
  },
  actors,
  actions: {
    nextGuess: assign({
      currentGuess: blankGuess,
      currentGuessIndex: 0,
      shouldValidate: ({ context }) => {
        const _cpy = [...context.shouldValidate];
        _cpy[context.guessNumber] = true;
        return _cpy;
      },
      guessNumber: ({ context }) => context.guessNumber + 1,
      guesses: ({ context }) => {
        const __guessesTmp = [...context.guesses];
        __guessesTmp[context.guessNumber] = context.currentGuess.join("");
        return __guessesTmp;
      },
    }),
    updateCurrentGuess: assign({
      currentGuess: ({ context, event }) => {
        if (context.currentGuess.filter((ltr) => !!ltr).length === 5) {
          return context.currentGuess;
        }

        const _cpy = [...context.currentGuess];
        _cpy[context.currentGuessIndex] = event.value.toLowerCase();
        return _cpy;
      },
      currentGuessIndex: ({ context }) =>
        Math.min(5, context.currentGuessIndex + 1),
    }),
    backspaceGuess: assign({
      currentGuess: ({ context }) => {
        const _cpy = [...context.currentGuess];
        _cpy[Math.max(0, context.currentGuessIndex - 1)] = "";
        return _cpy;
      },
      currentGuessIndex: ({ context }) =>
        Math.max(0, context.currentGuessIndex - 1),
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
  },
}).createMachine({
  id: "g5lgg",
  initial: "loading",
  context,
  states: {
    loading: {
      invoke: {
        src: "fetchWord",
        input: ({ context }) => ({ word: context.word }),
        onDone: {
          target: "loaded",
          actions: assign({
            word: ({ event }) => event.output?.word || "",
          }),
        },
        onError: "failed",
      },
    },
    loaded: {
      initial: "play",
      states: {
        validating: {
          invoke: {
            src: "isValidMove",
            input: ({ context }) => ({
              word: context.currentGuess.filter((val) => !!val).join(""),
              guesses: context.guesses,
            }),
            onDone: {
              target: "play",
              actions: {
                type: "nextGuess",
              },
            },
            onError: {
              target: "play",
            },
          },
        },
        play: {
          always: [
            { target: "gameover.solved", guard: "checkWord" },
            { target: "gameover.unsolved", guard: "checkAllGuesses" },
          ],
          on: {
            UPDATE: [
              {
                actions: {
                  type: "updateCurrentGuess",
                },
              },
            ],
            BACK: [
              {
                actions: {
                  type: "backspaceGuess",
                },
              },
            ],
            ENTER: [
              {
                target: "validating",
              },
            ],
          },
        },
        gameover: {
          initial: "unsolved",
          states: {
            solved: {},
            unsolved: {},
          },
        },
      },
    },
    failed: {},
  },
});
