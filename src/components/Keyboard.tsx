import React, { useEffect } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  disabledKeys: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, disabledKeys }) => {
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

  return (
    <div className="flex flex-col gap-2 mt-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`
                p-3 rounded-lg font-bold 
                ${
                  disabledKeys.includes(key.toUpperCase())
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                } 
                transition-colors duration-150
              `}>
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
