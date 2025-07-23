import React, { useState } from "react";

export default function QuizTemplate({
  range = 5,
  gridSize = { x: 50, y: 30 },
  questionCount = 10,
  showHints = false,
}) {
  const width = gridSize.x * (range + 1);
  const height = gridSize.y * (range + 1);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [manualAnswer, setManualAnswer] = useState("");
  const [question, setQuestion] = useState(makeQuestion());
  const [feedback, setFeedback] = useState("");
  const [count, setCount] = useState(1);

  function makeQuestion() {
    const slope = Math.random() > 0.5 ? 1 : -1;
    const intercept = Math.floor(Math.random() * (range - 1)) + 1; // keep it inside visible

    const isFindX = Math.random() > 0.5;
    if (isFindX) {
      const yValue = Math.floor(Math.random() * range) + 1; // 1..range
      const correctX = (yValue - intercept) / slope;
      return {
        type: "findX",
        slope,
        intercept,
        yValue,
        correctX,
        correctY: null,
      };
    } else {
      const xValue = Math.floor(Math.random() * range) + 1;
      const correctY = slope * xValue + intercept;
      return {
        type: "findY",
        slope,
        intercept,
        xValue,
        correctY,
        correctX: null,
      };
    }
  }

  const handleClick = (event) => {
    const svg = event.currentTarget;
    const box = svg.getBoundingClientRect();

    const offsetX = event.clientX - box.left - 40;
    const offsetY = event.clientY - box.top;

    const clickedX = offsetX / gridSize.x;
    const clickedY = (height - 20 - offsetY) / gridSize.y;

    let snappedX = Math.round(clickedX);
    let snappedY = Math.round(clickedY);

    // Clamp inside grid
    snappedX = Math.max(1, Math.min(range, snappedX));
    snappedY = Math.max(1, Math.min(range, snappedY));

    setSelectedPoint({ x: snappedX, y: snappedY });
    setManualAnswer("");
  };

  const handleSubmit = () => {
    let isCorrect = false;
    let correctVal = 0;

    if (question.type === "findX") {
      const correctX = question.correctX;
      correctVal = correctX;

      if (selectedPoint) {
        isCorrect = Math.abs(selectedPoint.x - correctX) < 0.5;
      }
      if (manualAnswer !== "") {
        const typed = parseFloat(manualAnswer);
        isCorrect = Math.abs(typed - correctX) < 0.5;
      }
    } else {
      const correctY = question.correctY;
      correctVal = correctY;

      if (selectedPoint) {
        isCorrect = Math.abs(selectedPoint.y - correctY) < 0.5;
      }
      if (manualAnswer !== "") {
        const typed = parseFloat(manualAnswer);
        isCorrect = Math.abs(typed - correctY) < 0.5;
      }
    }

    if (isCorrect) {
      setFeedback(`✅ Correct! Answer ≈ ${correctVal.toFixed(2)}`);
    } else {
      setFeedback(`❌ Wrong! Correct ≈ ${correctVal.toFixed(2)}`);
    }

    setTimeout(() => {
      if (count < questionCount) {
        setCount(count + 1);
        setSelectedPoint(null);
        setManualAnswer("");
        setFeedback("");
        setQuestion(makeQuestion());
      } else {
        setFeedback("🎉 Quiz Finished!");
      }
    }, 1500);
  };

  // Compute line only inside visible range
  const x1 = 1;
  const y1 = question.slope * x1 + question.intercept;

  const x2 = range;
  const y2 = question.slope * x2 + question.intercept;

  // Clamp Y values so they stay in the visible grid (1..range)
  const clampedY1 = Math.max(1, Math.min(range, y1));
  const clampedY2 = Math.max(1, Math.min(range, y2));

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 500,
        margin: "auto",
        textAlign: "center",
        fontFamily: "sans-serif",
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <h2>
        Q{count}/{questionCount}{" "}
        {question.type === "findX"
          ? `Find x where y = ${question.yValue}`
          : `Find y where x = ${question.xValue}`}
      </h2>

      {/* SHOW EQUATION */}
      <p>
        <b>Line equation:</b> y ={" "}
        {question.slope === 1 ? "" : "-"}
        x + {question.intercept}
      </p>

      <svg
        width={width + 60}
        height={height + 40}
        style={{
          border: "1px solid black",
          background: "white",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <g transform="translate(40,10)">
          {/* GRID */}
          {Array.from({ length: range }, (_, i) => (
            <g key={i + 1}>
              <line
                x1={(i + 1) * gridSize.x}
                y1="0"
                x2={(i + 1) * gridSize.x}
                y2={height - 20}
                stroke="#eee"
              />
              <line
                x1="0"
                y1={(i + 1) * gridSize.y}
                x2={range * gridSize.x}
                y2={(i + 1) * gridSize.y}
                stroke="#eee"
              />
            </g>
          ))}

          {/* AXES */}
          <line
            x1="0"
            y1={height - 20}
            x2={range * gridSize.x}
            y2={height - 20}
            stroke="black"
          />
          <line x1="0" y1="0" x2="0" y2={height - 20} stroke="black" />

          {/* FUNCTION LINE ONLY INSIDE RANGE */}
          <line
            x1={x1 * gridSize.x}
            y1={height - 20 - clampedY1 * gridSize.y}
            x2={x2 * gridSize.x}
            y2={height - 20 - clampedY2 * gridSize.y}
            stroke="blue"
            strokeWidth={2}
          />

          {/* HINT LINE (optional) */}
          {showHints &&
            (question.type === "findX" ? (
              <line
                x1="0"
                y1={height - 20 - question.yValue * gridSize.y}
                x2={range * gridSize.x}
                y2={height - 20 - question.yValue * gridSize.y}
                stroke="red"
                strokeDasharray="4 4"
              />
            ) : (
              <line
                x1={question.xValue * gridSize.x}
                y1="0"
                x2={question.xValue * gridSize.x}
                y2={height - 20}
                stroke="red"
                strokeDasharray="4 4"
              />
            ))}

          {/* SELECTED POINT */}
          {selectedPoint && (
            <circle
              cx={selectedPoint.x * gridSize.x}
              cy={(range + 1 - selectedPoint.y) * gridSize.y}
              r={5}
              fill="red"
            />
          )}

          {/* Y labels */}
          {Array.from({ length: range }, (_, i) => (
            <text
              key={`y-${i + 1}`}
              x="-8"
              y={(range - i) * gridSize.y + 4}
              fontSize="12"
              textAnchor="end"
            >
              {i + 1}
            </text>
          ))}

          {/* X labels */}
          {Array.from({ length: range }, (_, i) => (
            <text
              key={`x-${i + 1}`}
              x={(i + 1) * gridSize.x}
              y={height - 5}
              fontSize="12"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          ))}

          {/* axis labels */}
          <text x={(range / 2) * gridSize.x} y={height} textAnchor="middle">
            x
          </text>
          <text
            x="-25"
            y={(height - 20) / 2}
            textAnchor="middle"
            transform={`rotate(-90, -25, ${(height - 20) / 2})`}
          >
            y
          </text>
        </g>
      </svg>

      {/* Selected info */}
      <p>
        Selected:{" "}
        {selectedPoint ? `x=${selectedPoint.x}, y=${selectedPoint.y}` : "None"}
      </p>

      {/* Manual input */}
      <input
        type="number"
        placeholder={
          question.type === "findX" ? "Type x value" : "Type y value"
        }
        value={manualAnswer}
        onChange={(e) => setManualAnswer(e.target.value)}
        style={{
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "120px",
        }}
      />

      <br />

      <button
        onClick={handleSubmit}
        disabled={!selectedPoint && manualAnswer === ""}
        style={{
          padding: "6px 12px",
          background: "green",
          color: "#fff",
          border: "none",
          marginTop: "15px",
          borderRadius: "4px",
          cursor:
            selectedPoint || manualAnswer !== "" ? "pointer" : "not-allowed",
        }}
      >
        Submit
      </button>

      {feedback && <p style={{ marginTop: "10px" }}>{feedback}</p>}
    </div>
  );
}
