import React from "react";

type GameBoardProps = {
  guesses: string[];
  solution: string;
};

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, solution }) => {
  const emptyRows = Array.from({ length: 6 - guesses.length });

  const getCellStyle = (char: string, index: number) => {
    if (!solution) return "";
    if (char === solution[index]) return "bg-green-500 text-white";
    else if (solution.includes(char)) return "bg-yellow-500 text-white";
    return "bg-gray-700 text-white";
  };

  return (
    <div className="grid grid-rows-6 gap-2 text-center text-xl font-bold">
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {guess.padEnd(5).split("").map((char, colIndex) => (
            <div
              key={colIndex}
              className={`w-12 h-12 flex items-center justify-center border ${getCellStyle(
                char,
                colIndex
              )}`}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      {emptyRows.map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              className="w-12 h-12 flex items-center justify-center border border-gray-600"
            >
              &nbsp;
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
