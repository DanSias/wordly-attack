// hooks/useDictionary.ts

import { useEffect, useState } from "react";

/**
 * Custom hook to load the dictionary of valid 5-letter words.
 *
 * - Loads the dictionary from a JSON file located in the `public/data` directory.
 * - Converts the word list into a Set for O(1) lookup performance.
 * - Ensures fast validation of user inputs in the game.
 *
 * Usage:
 * const dictionarySet = useDictionary();
 * if (dictionarySet?.has(guess)) { // Validate user guess }
 *
 * This hook ensures the dictionary is only loaded once and cached for reuse.
 */

const useDictionary = () => {
  const [dictionarySet, setDictionarySet] = useState<Set<string> | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const response = await fetch("/data/dictionary.json");
        const wordList: string[] = await response.json();
        setDictionarySet(new Set(wordList)); // Convert to Set for O(1) lookups
      } catch (error) {
        console.error("Failed to load dictionary:", error);
      }
    };

    loadDictionary();
  }, []);

  return dictionarySet;
};

export default useDictionary;
