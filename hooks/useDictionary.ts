import { Asset } from "expo-asset";
import { readAsStringAsync } from "expo-file-system";

export const useDictionary = async (): Promise<string | null> => {
  const [{ localUri }] = await Asset.loadAsync(
    require("../assets/g5lgg-words.txt")
  );

  if (localUri) {
    readAsStringAsync(localUri).then((contents) => {
      console.log("CONTENTS", contents.split("\n"));
    });
  }

  return null
};
