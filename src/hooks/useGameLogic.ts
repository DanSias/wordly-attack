import { useState } from "react";
import { WordEntry } from "@/types/word";
import words from "@/data/words.json";
import toast from "react-hot-toast";

// Type the imported JSON as an array of WordEntry
const wordList: WordEntry[] = words;
const validWordsSet = new Set(
  wordList.map((entry) => entry.word.toLowerCase())
);

type KeyStatus = "correct" | "misplaced" | "wrong";

// Function to get a random word
const getRandomWord = (): string => {
  const randomEntry: WordEntry =
    wordList[Math.floor(Math.random() * wordList.length)];
  return randomEntry.word.toUpperCase();
};

// Function to get today's word based on the current date
const getTodayWord = (): string => {
  const todayISO = new Date().toISOString().split("T")[0];
  const todayEntry: WordEntry | undefined = wordList.find(
    (entry) => entry.date_iso === todayISO
  );

  // Fallback to a random word if today's word isn't found
  return todayEntry ? todayEntry.word.toUpperCase() : getRandomWord();
};

// Interface for the hook's return values
interface GameLogic {
  guesses: string[];
  currentGuess: string;
  feedback: string[][];
  handleKeyPress: (key: string) => void;
  gameOver: boolean;
  resetGame: () => void;
  keyStatus: { [key: string]: KeyStatus };
}

// The main game logic hook
export const useGameLogic = (dailyMode = false): GameLogic => {
  const [targetWord, setTargetWord] = useState<string>(
    dailyMode ? getTodayWord() : getRandomWord()
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [keyStatus, setKeyStatus] = useState<{ [key: string]: KeyStatus }>({});

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === "Enter" && currentGuess.length === 5) {
      if (!validWordsSet.has(currentGuess.toLowerCase())) {
        toast.error(
          `\"${currentGuess}\" is not a real word. \nPlease try again.`
        );
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      checkGuess(currentGuess);
      setCurrentGuess("");

      if (currentGuess === targetWord) {
        setGameOver(true);
        toast.success("✨ You guessed the word! ✨", {
          className: "bg-green-600 text-white text-xl p-5 rounded-xl shadow-lg",
        });
      } else if (newGuesses.length === 6) {
        setGameOver(true);
        toast.error(`😔 Game Over! The word was \"${targetWord}\".`);
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
    }
  };

  const checkGuess = (guess: string) => {
    const feedbackRow = guess.split("").map((char, idx) => {
      if (char === targetWord[idx]) {
        updateKeyStatus(char, "correct");
        return "correct";
      }
      if (targetWord.includes(char)) {
        updateKeyStatus(char, "misplaced");
        return "misplaced";
      }
      updateKeyStatus(char, "wrong");
      return "wrong";
    });
    setFeedback((prev) => [...prev, feedbackRow]);
  };

  const updateKeyStatus = (key: string, status: KeyStatus) => {
    setKeyStatus((prevStatus) => {
      const currentStatus = prevStatus[key];
      const priority: Record<KeyStatus, number> = {
        correct: 3,
        misplaced: 2,
        wrong: 1,
      };

      if (!currentStatus || priority[status] > priority[currentStatus]) {
        return { ...prevStatus, [key]: status };
      }
      return prevStatus;
    });
  };

  const resetGame = () => {
    setTargetWord(dailyMode ? getTodayWord() : getRandomWord());
    setGuesses([]);
    setFeedback([]);
    setCurrentGuess("");
    setGameOver(false);
    setKeyStatus({}); // Reset key statuses
  };

  return {
    guesses,
    currentGuess,
    feedback,
    handleKeyPress,
    gameOver,
    resetGame,
    keyStatus,
  };
};
