import { Asset } from "expo-asset";
import { readAsStringAsync } from "expo-file-system";

type DictionaryType = { word: string };

export const getDictionary = async (): Promise<string[]> => {
  const [{ localUri }] = await Asset.loadAsync(
    require("../assets/g5lgg-words.txt")
  );

  if (localUri) {
    return readAsStringAsync(localUri).then((contents) => {
      return contents.split("\n");
    });
  } else {
    return [];
  }
};

export const useDictionary = async (): Promise<DictionaryType | null> => {
  const activeIndex = await fetch(
    "https://raw.githubusercontent.com/enlightenedpie/g5lgg/refs/heads/datastore/data/activeIndex.txt"
  ).then((res) => res.text());

  const wordArray = await getDictionary();

  if (wordArray.length > 0) {
    return { word: wordArray[Number(activeIndex)] };
  }

  return null;
};
