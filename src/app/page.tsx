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

import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import Timer from "@/components/Timer";
import { useGameLogic } from "@/hooks/useGameLogic";
import toast from "react-hot-toast";

const HomePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(120); // Start with 2 minutes

  const {
    guesses,
    currentGuess,
    feedback,
    handleKeyPress,
    gameOver,
    resetGame,
  } = useGameLogic();

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleTimeUp = () => {
    if (!gameOver) {
      toast.error("\u23F0 Time’s up! You lost this round.", {
        className: "bg-red-600 text-white text-xl p-5 rounded-xl shadow-lg",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-slate-900 p-4">
      {!gameStarted ? (
        <div className="text-center text-white space-y-4 mt-24">
          <h1 className="text-4xl">
            Welcome to <span className="font-bold">Wordly Attack</span>!
          </h1>
          <p className="text-xl max-w-xl pb-8">
            <br />
            This is a race against time. You will have{" "}
            <span className="font-bold">2 minutes</span> to solve the first
            word, but each subsequent round will have a shorter timer, ramping
            up the challenge as you progress. How far can you go?
          </p>
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg text-xl shadow-md hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-700 transition-transform transform hover:scale-105">
            Start the Game
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-6 text-white">Wordly Attack</h1>

          <Timer
            initialTime={roundTime}
            onTimeUp={handleTimeUp}
            gameOver={gameOver}
          />

          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            feedback={feedback}
          />

          <Keyboard
            onKeyPress={gameStarted ? handleKeyPress : () => {}}
            keyStatus={{}}
          />

          {gameOver && (
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-red-500">
                {guesses.includes(currentGuess)
                  ? "You Won!"
                  : `Game Over! The word was \"${
                      guesses[guesses.length - 1]
                    }\".`}
              </p>
              <button
                onClick={() => {
                  resetGame();
                  setRoundTime((prevTime) => Math.max(prevTime - 10, 60)); // Reduce time by 10s each round, minimum 60s
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Next Round
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
