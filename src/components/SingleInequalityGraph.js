import React, { useState } from "react";

function getRandomInequality() {
  const variables = ["x", "y", "a", "b"];
  const variable = variables[Math.floor(Math.random() * variables.length)];

  const bound = Math.floor(Math.random() * 9) - 4; // -4 to 4
  const operators = [
    { symbol: ">", direction: "right", open: true },
    { symbol: "<", direction: "left", open: true },
    { symbol: "≥", direction: "right", open: false },
    { symbol: "≤", direction: "left", open: false },
  ];
  const op = operators[Math.floor(Math.random() * operators.length)];

  return {
    text: `${variable} ${op.symbol} ${bound}`,
    bound,
    correctDirection: op.direction,
    correctType: op.open ? "open" : "closed",
  };
}

export default function SingleInequalityGraph() {
  const min = -6;
  const max = 6;
  const width = 500;
  const height = 100;

  const scale = (val) => ((val - min) / (max - min)) * width;
  const unscale = (x) => Math.round(((x / width) * (max - min)) + min);

  const [quiz, setQuiz] = useState(getRandomInequality());
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [rayDirection, setRayDirection] = useState(null); // fixed left/right
  const [previewDirection, setPreviewDirection] = useState(null); // live preview
  const [endpointType, setEndpointType] = useState("open");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [waitingForDirection, setWaitingForDirection] = useState(false);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const nearestTick = Math.min(max, Math.max(min, unscale(clickX)));

    // If clicking same endpoint → toggle open/closed
    if (selectedPoint === nearestTick && !waitingForDirection) {
      setEndpointType((prev) => (prev === "open" ? "closed" : "open"));
      return;
    }

    if (!selectedPoint) {
      // First click → choose endpoint
      setSelectedPoint(nearestTick);
      setWaitingForDirection(true);
      setPreviewDirection(null);
      setRayDirection(null);
      setResult(null);
    } else if (waitingForDirection) {
      // Second click → finalize ray direction
      const dir = nearestTick < selectedPoint ? "left" : "right";
      setRayDirection(dir);
      setPreviewDirection(null);
      setWaitingForDirection(false);
    } else {
      // Third click → reset
      resetSelection();
    }
  };

  const handleMouseMove = (e) => {
    if (!waitingForDirection || !selectedPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const hoverTick = Math.min(max, Math.max(min, unscale(moveX)));
    const dir = hoverTick < selectedPoint ? "left" : "right";
    setPreviewDirection(dir);
  };

  const resetSelection = () => {
    setSelectedPoint(null);
    setRayDirection(null);
    setPreviewDirection(null);
    setWaitingForDirection(false);
    setEndpointType("open");
  };

  const checkAnswer = () => {
    if (!selectedPoint || !rayDirection) {
      setResult("❌ Select endpoint & fix ray direction first!");
      return;
    }

    const isCorrect =
      selectedPoint === quiz.bound &&
      endpointType === quiz.correctType &&
      rayDirection === quiz.correctDirection;

    setAttempts((prev) => prev + 1);

    if (isCorrect) {
      setResult("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setResult(
        `❌ Wrong! Correct: ${quiz.text} → ${quiz.correctType} at ${
          quiz.bound
        }, shade ${quiz.correctDirection}`
      );
    }
  };

  const nextQuestion = () => {
    setQuiz(getRandomInequality());
    resetSelection();
    setResult(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Graph the inequality</h2>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{quiz.text}</p>

      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", cursor: "pointer" }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Base number line */}
        <line x1={0} y1={50} x2={width} y2={50} stroke="black" strokeWidth="2" />
        {/* Arrows */}
        <polygon points="0,50 8,46 8,54" fill="black" />
        <polygon points={`${width},50 ${width - 8},46 ${width - 8},54`} fill="black" />

        {/* Tick marks */}
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const num = min + i;
          const x = scale(num);
          return (
            <g key={i}>
              <line x1={x} y1={45} x2={x} y2={55} stroke="black" />
              <text x={x} y={70} fontSize="12" textAnchor="middle">
                {num}
              </text>
            </g>
          );
        })}

        {/* PREVIEW ray while hovering */}
        {selectedPoint !== null && previewDirection === "left" && (
          <line
            x1={scale(selectedPoint)}
            y1={50}
            x2={0}
            y2={50}
            stroke="orange"
            strokeWidth="4"
            strokeDasharray="6,3"
          />
        )}
        {selectedPoint !== null && previewDirection === "right" && (
          <line
            x1={scale(selectedPoint)}
            y1={50}
            x2={width}
            y2={50}
            stroke="orange"
            strokeWidth="4"
            strokeDasharray="6,3"
          />
        )}

        {/* FIXED ray after second click */}
        {selectedPoint !== null && rayDirection === "left" && (
          <line
            x1={scale(selectedPoint)}
            y1={50}
            x2={0}
            y2={50}
            stroke="blue"
            strokeWidth="4"
          />
        )}
        {selectedPoint !== null && rayDirection === "right" && (
          <line
            x1={scale(selectedPoint)}
            y1={50}
            x2={width}
            y2={50}
            stroke="blue"
            strokeWidth="4"
          />
        )}

        {/* Endpoint circle */}
        {selectedPoint !== null && (
          <circle
            cx={scale(selectedPoint)}
            cy={50}
            r={8}
            stroke="blue"
            strokeWidth="2"
            fill={endpointType === "closed" ? "blue" : "white"}
          />
        )}
      </svg>

      <p style={{ marginTop: "10px" }}>
        👉 <b>1st click:</b> place endpoint <br />
        👉 <b>Move mouse:</b> see orange preview ray <br />
        👉 <b>2nd click:</b> fix ray direction (blue) <br />
        👉 Click endpoint again to toggle open/closed
      </p>

      {/* Buttons */}
      <div style={{ marginTop: "15px" }}>
        <button
          onClick={checkAnswer}
          disabled={!selectedPoint || !rayDirection}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            background: !selectedPoint || !rayDirection ? "#ccc" : "#2e8b57",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: !selectedPoint || !rayDirection ? "not-allowed" : "pointer",
          }}
        >
          Check Answer
        </button>
        <button
          onClick={nextQuestion}
          style={{
            padding: "10px 20px",
            background: "#4169e1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next Question
        </button>
      </div>

      {/* Feedback */}
      {result && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: result.includes("✅") ? "#d4edda" : "#f8d7da",
            color: result.includes("✅") ? "#155724" : "#721c24",
            border: `1px solid ${
              result.includes("✅") ? "#c3e6cb" : "#f5c6cb"
            }`,
            borderRadius: "5px",
          }}
        >
          {result}
        </div>
      )}

      {/* Score */}
      <p style={{ marginTop: "15px" }}>
        ✅ Correct: <b>{score}</b> / Attempts: <b>{attempts}</b>
      </p>
    </div>
  );
}
