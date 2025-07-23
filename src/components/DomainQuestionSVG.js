import React, { useState } from "react";

// ✅ Helper: Get unique sorted numbers
const uniqueSorted = (arr) => Array.from(new Set(arr)).sort((a, b) => a - b);

// ✅ Generate a random set of points
function generateRandomPoints(min = -5, max = 5) {
  const numPoints = Math.floor(Math.random() * 2) + 3; // 3 or 4 points
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    const y = Math.floor(Math.random() * (max - min + 1)) + min;
    points.push([x, y]);
  }
  return points;
}

// ✅ Randomly choose whether to ask Domain or Range
function getRandomQuestionType() {
  return Math.random() > 0.5 ? "domain" : "range";
}

export default function DomainQuestionSVG() {
  const [points, setPoints] = useState(generateRandomPoints());
  const [questionType, setQuestionType] = useState(getRandomQuestionType());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Correct answers
  const correctDomain = uniqueSorted(points.map(([x]) => x));
  const correctRange = uniqueSorted(points.map(([_, y]) => y));

  const correctAnswerArray =
    questionType === "domain" ? correctDomain : correctRange;

  const formatInput = (input) =>
    input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");

  const checkAnswer = () => {
    const userAnswer = formatInput(answer);
    const correct = userAnswer.join(",") === correctAnswerArray.join(",");

    if (correct) {
      setFeedback("✅ Correct! Well done.");
    } else {
      setFeedback(
        `❌ Incorrect. The correct ${
          questionType === "domain" ? "Domain" : "Range"
        } is {${correctAnswerArray.join(", ")}}.`
      );
    }
  };

  const nextQuestion = () => {
    setPoints(generateRandomPoints());
    setQuestionType(getRandomQuestionType());
    setAnswer("");
    setFeedback(null);
  };

  // SVG config
  const size = 300;
  const gridStep = 30;
  const axisRange = 5;
  const center = size / 2;

  return (
    <div style={{ maxWidth: 450, margin: "20px auto", textAlign: "center" }}>
      <h3>
        Find the{" "}
        <b>{questionType === "domain" ? "Domain" : "Range"}</b> of this relation
      </h3>

      <svg width={size} height={size} style={{ border: "1px solid #ccc" }}>
        {/* Grid lines */}
        {Array.from({ length: axisRange * 2 + 1 }, (_, i) => {
          const offset = i - axisRange;
          const pos = center + offset * gridStep;
          return (
            <g key={i}>
              <line x1={pos} y1={0} x2={pos} y2={size} stroke="#eee" />
              <line x1={0} y1={pos} x2={size} y2={pos} stroke="#eee" />
            </g>
          );
        })}

        {/* Axes */}
        <line x1={0} y1={center} x2={size} y2={center} stroke="black" />
        <line x1={center} y1={0} x2={center} y2={size} stroke="black" />

        {/* Axis labels */}
        {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((val) => (
          <g key={val}>
            {/* X labels */}
            <text x={center + val * gridStep - 5} y={center + 15} fontSize="10">
              {val}
            </text>
            {/* Y labels */}
            <text x={center + 5} y={center - val * gridStep + 4} fontSize="10">
              {val}
            </text>
          </g>
        ))}

        {/* Random Points */}
        {points.map(([x, y], idx) => (
          <circle
            key={idx}
            cx={center + x * gridStep}
            cy={center - y * gridStep}
            r={5}
            fill="black"
          />
        ))}
      </svg>

      <p>
        Enter the {questionType === "domain" ? "Domain" : "Range"} with commas <br />
        Example: {"{ -3, -2, 5 }"}
      </p>

      {/* Single input */}
      <div style={{ marginBottom: 10 }}>
        {questionType === "domain" ? "Domain" : "Range"}: {"{"}
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="-3, -2, 5"
          style={{ padding: "5px", width: 180, margin: "0 5px" }}
        />
        {"}"}
      </div>

      {/* Buttons */}
      <div>
        <button
          onClick={checkAnswer}
          style={{
            marginRight: 10,
            padding: "6px 12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          ✅ Check
        </button>
        <button
          onClick={nextQuestion}
          style={{
            padding: "6px 12px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          ➡️ Next Question
        </button>
      </div>

      {/* Feedback */}
      {feedback && <p style={{ marginTop: 10 }}>{feedback}</p>}
    </div>
  );
}
