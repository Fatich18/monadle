// components/GameBoard.tsx
import React from "react";

export default function GameBoard({ guesses }: { guesses: string[] }) {
  const rows = 6;
  const cols = 5;

  return (
    <div style={{ display: "grid", gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 8 }}>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const guess = guesses[rowIndex] || "";
        return (
          <div
            key={rowIndex}
            style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: 40,
                  height: 40,
                  border: "2px solid #555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  background: "#fff",
                }}
              >
                {guess[colIndex] || ""}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
