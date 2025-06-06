// components/Keyboard.tsx
import React from "react";

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function Keyboard({ onKeyPress }: { onKeyPress: (key: string) => void }) {
  return (
    <div>
      {keys.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", margin: 4 }}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              style={{
                margin: "4px",
                padding: "10px 14px",
                fontSize: 16,
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <button onClick={() => onKeyPress("ENTER")}>ENTER</button>
        <button onClick={() => onKeyPress("DELETE")}>DELETE</button>
      </div>
    </div>
  );
}
