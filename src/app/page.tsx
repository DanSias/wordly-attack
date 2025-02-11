"use client";

/**
 * HomePage Component for Wordly Attack
 *
 * This component integrates the main game elements:
 * - GameBoard: Displays the guessing grid.
 * - Keyboard: On-screen keyboard with physical key detection.
 * - Timer: Countdown timer for each round.
 *
 * Game logic is managed using the useGameLogic hook, handling:
 * - Word selection (random or daily mode)
 * - Guess validation and feedback
 * - Game state (win/loss conditions)
 *
 * This page serves as the main entry point for the game.
 */

import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import Timer from "@/components/Timer";
import { useGameLogic } from "@/hooks/useGameLogic";
import toast from "react-hot-toast";

const HomePage = () => {
  const {
    guesses,
    currentGuess,
    feedback,
    handleKeyPress,
    gameOver,
    resetGame,
  } = useGameLogic();

  const handleTimeUp = () => {
    if (!gameOver) {
      toast.error("⏰ Time’s up! You lost this round.", {
        className: "bg-red-600 text-white text-xl p-5 rounded-xl shadow-lg",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-slate-900 p-4">
      <h1 className="text-4xl font-bold mb-6">Wordly Attack</h1>

      <Timer initialTime={120} onTimeUp={handleTimeUp} />

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        feedback={feedback}
      />

      <Keyboard onKeyPress={handleKeyPress} disabledKeys={[]} />

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold text-red-500">
            {guesses.includes(currentGuess) ? "You Won!" : "Game Over!"}
          </p>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
