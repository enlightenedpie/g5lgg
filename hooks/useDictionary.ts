import { Asset } from "expo-asset";
import { readAsStringAsync } from "expo-file-system";

type DictionaryType = { word: string };

export const useDictionary = async (): Promise<DictionaryType | null> => {
  const activeIndex = await fetch(
    "https://raw.githubusercontent.com/enlightenedpie/five-letter-guessing-game/refs/heads/main/data/activeIndex.txt"
  ).then((res) => res.text());

  const [{ localUri }] = await Asset.loadAsync(
    require("../assets/g5lgg-words.txt")
  );

  if (localUri) {
    return readAsStringAsync(localUri).then((contents) => {
      const wordArray = contents.split("\n");
      return { word: wordArray[Number(activeIndex)] };
    });
  }

  return null;
};
