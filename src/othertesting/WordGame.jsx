import React, { useState, useEffect } from "react";
// import "./styles.css"; // TailwindCSS required

// Fixed grid with valid words embedded
const letterGrid = [
  ["B", "N", "A", "W", "X", "X", "T"], // BOW (col 0), WAVE (starts at col 3), BAT ends at col 6
  ["O", "O", "S", "A", "A", "A", "A"], // WAVE A
  ["W", "S", "U", "V", "V", "V", "B"], // WAVE V, BAT mid
  ["D", "O", "G", "E", "R", "O", "F"], // DOG, WAVE E
  ["M", "E", "R", "A", "S", "E", "B"], // ERASE
  ["X", "X", "X", "X", "X", "X", "X"],
  ["C", "A", "T", "X", "X", "X", "X"], // CAT
];

const validWords = {
  BOW: 65,
  BAT: 30,
  DOG: 45,
  CAT: 25,
  WAVE: 70,
  ERASE: 60,
};

export default function WordGame() {
  const [selectedCells, setSelectedCells] = useState([]);
  const [direction, setDirection] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(90);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let interval;
    if (started && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [started, timer]);

  const currentWord = selectedCells.map(([r, c]) => letterGrid[r][c]).join("");

  const handleSelect = (row, col) => {
    const alreadySelected = selectedCells.some(
      ([r, c]) => r === row && c === col
    );
    if (alreadySelected) return;

    if (selectedCells.length === 0) {
      setSelectedCells([[row, col]]);
    } else if (selectedCells.length === 1) {
      const [r1, c1] = selectedCells[0];
      const dr = row - r1;
      const dc = col - c1;
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) {
        setDirection([dr, dc]);
        setSelectedCells([...selectedCells, [row, col]]);
      }
    } else {
      const [dr, dc] = direction;
      const [lastRow, lastCol] = selectedCells[selectedCells.length - 1];
      const expectedRow = lastRow + dr;
      const expectedCol = lastCol + dc;
      if (row === expectedRow && col === expectedCol) {
        setSelectedCells([...selectedCells, [row, col]]);
      }
    }
  };

  const handleSubmit = () => {
    if (validWords[currentWord] && !usedWords.includes(currentWord)) {
      setScore(score + validWords[currentWord]);
      setUsedWords([...usedWords, currentWord]);
    }
    setSelectedCells([]);
    setDirection(null);
  };

  const handleReset = () => {
    setSelectedCells([]);
    setUsedWords([]);
    setScore(0);
    setTimer(90);
    setStarted(true);
    setDirection(null);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Word Grid Game</h1>

      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        {/* Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {letterGrid.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
              const selected = selectedCells.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer ${
                    selected
                      ? "bg-yellow-300 text-black"
                      : "bg-blue-200 hover:bg-blue-300"
                  }`}
                  onClick={() => handleSelect(rowIndex, colIndex)}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        {/* Current Word */}
        <div className="mb-4 text-center text-lg font-semibold">
          Current Word: <span className="text-blue-600">{currentWord}</span>
        </div>

        {/* Score */}
        <div className="text-center mb-4 text-xl font-bold text-green-600">
          Score: {score}
        </div>

        {/* Timer & Reset */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-700">
          <span>Time Left: {timer}s</span>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            {started ? "Reset" : "Start"}
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-600"
          >
            Submit Word
          </button>
        </div>

        {/* Word History */}
        {usedWords.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold text-gray-600 mb-1">Words Found:</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {usedWords.map((word, idx) => (
                <li key={idx}>
                  {word}{" "}
                  <span className="text-green-600">+{validWords[word]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

