import React, { useEffect } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatus: { [key: string]: "correct" | "misplaced" | "wrong" | undefined };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatus }) => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase(); // Convert key to uppercase for consistency

      if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
      } else if (event.key === "Enter" || event.key === "Backspace") {
        onKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);
    return () => window.removeEventListener("keydown", handlePhysicalKeyPress);
  }, [onKeyPress]);

  // Function to determine key color based on status
  const getKeyClass = (key: string) => {
    switch (keyStatus[key]) {
      case "correct":
        return "bg-green-500 text-white";
      case "misplaced":
        return "bg-yellow-500 text-white";
      case "wrong":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600";
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`p-3 rounded-lg font-bold transition-colors duration-150 ${getKeyClass(
                key.toUpperCase()
              )}`}>
              {key === "Backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
