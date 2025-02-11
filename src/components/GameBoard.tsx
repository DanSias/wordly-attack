// components/GameBoard.tsx
interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  feedback: string[][]; // Feedback for each guess (correct, misplaced, wrong)
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  feedback,
}) => {
  const totalRows = 6;
  const wordLength = 5;

  return (
    <div className="grid grid-rows-6 gap-2">
      {[...Array(totalRows)].map((_, rowIndex) => {
        const guess =
          guesses[rowIndex] ||
          (rowIndex === guesses.length ? currentGuess : "");
        const rowFeedback = feedback[rowIndex] || [];

        return (
          <div key={rowIndex} className="grid grid-cols-5 gap-1">
            {[...Array(wordLength)].map((_, letterIndex) => (
              <div
                key={letterIndex}
                className={`w-20 h-20 border-2 flex items-center justify-center text-2xl font-bold rounded ${
                  rowFeedback[letterIndex]
                    ? rowFeedback[letterIndex] === "correct"
                      ? "bg-green-500 text-white"
                      : rowFeedback[letterIndex] === "misplaced"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-400 text-white"
                    : "border-gray-500"
                }`}>
                {guess[letterIndex]?.toUpperCase() || ""}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
