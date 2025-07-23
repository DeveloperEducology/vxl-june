import React, { useState } from "react";

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateQuestion() {
  const variables = ["x", "y", "a", "b"];
  const inequalities = ["<", ">", "<=", ">="];
  const types = ["open", "closed"];

  const variable = getRandomItem(variables);
  const inequality1 = getRandomItem(inequalities);
  const inequality2 = getRandomItem(inequalities);

  // Ensure we have a proper compound inequality (like 3 < x < 7)
  let lowerBound = Math.floor(Math.random() * 6) + 1; // 1-6
  let upperBound = lowerBound + Math.floor(Math.random() * 6) + 2; // at least 2 more than lower

  // Randomly decide if both ends are open, both closed, or mixed
  const lowerType = Math.random() > 0.5 ? "closed" : "open";
  const upperType = Math.random() > 0.5 ? "closed" : "open";

  // Create the compound inequality
  const validInequalities = [
    `${lowerBound} < ${variable} < ${upperBound}`,
    `${lowerBound} <= ${variable} < ${upperBound}`,
    `${lowerBound} < ${variable} <= ${upperBound}`,
    `${lowerBound} <= ${variable} <= ${upperBound}`,
  ];

  const question = getRandomItem(validInequalities);

  // Determine the correct endpoint types based on the inequality symbols
  let lowerCorrectType = "open";
  let upperCorrectType = "open";

  if (question.includes(`${lowerBound} <=`)) lowerCorrectType = "closed";
  if (question.includes(`${upperBound} <=`)) upperCorrectType = "closed";
  if (question.includes(`< ${lowerBound}`)) lowerCorrectType = "closed";
  if (question.includes(`< ${upperBound}`)) upperCorrectType = "closed";

  return {
    question,
    lowerBound,
    upperBound,
    lowerCorrectType,
    upperCorrectType,
  };
}

export default function InequalityQuiz() {
  const min = 0;
  const max = 20;
  const width = 500;
  const height = 80;

  const [quiz, setQuiz] = useState(generateQuestion());
  const [firstEndpoint, setFirstEndpoint] = useState(null);
  const [secondEndpoint, setSecondEndpoint] = useState(null);
  const [firstEndpointType, setFirstEndpointType] = useState("open");
  const [secondEndpointType, setSecondEndpointType] = useState("open");
  const [result, setResult] = useState(null);
  const [clickOrder, setClickOrder] = useState(1); // 1 for first click, 2 for second

  const scale = (val) => ((val - min) / (max - min)) * width;
  const unscale = (x) => Math.round((x / width) * (max - min) + min);

  // User clicks on the number line
  const handleLineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const nearestTick = Math.min(max, Math.max(min, unscale(clickX)));

    if (clickOrder === 1) {
      // First click - set first endpoint
      setFirstEndpoint(nearestTick);
      setFirstEndpointType("open");
      setClickOrder(2);
    } else {
      // Second click - set second endpoint
      setSecondEndpoint(nearestTick);
      setSecondEndpointType("open");
      // Reset result when making changes
      setResult(null);
    }
  };

  const toggleFirstEndpointType = (e) => {
    e.stopPropagation();
    if (firstEndpoint !== null) {
      setFirstEndpointType((prev) => (prev === "open" ? "closed" : "open"));
    }
  };

  const toggleSecondEndpointType = (e) => {
    e.stopPropagation();
    if (secondEndpoint !== null) {
      setSecondEndpointType((prev) => (prev === "open" ? "closed" : "open"));
    }
  };

  const resetSelection = () => {
    setFirstEndpoint(null);
    setSecondEndpoint(null);
    setFirstEndpointType("open");
    setSecondEndpointType("open");
    setClickOrder(1);
    setResult(null);
  };

  const checkAnswer = () => {
    if (firstEndpoint === null || secondEndpoint === null) {
      setResult("❌ Select both endpoints!");
      return;
    }

    // Determine which endpoint is lower and which is higher
    const lowerSelected = Math.min(firstEndpoint, secondEndpoint);
    const upperSelected = Math.max(firstEndpoint, secondEndpoint);

    // Get the types for the lower and upper bounds
    const selectedLowerType =
      firstEndpoint <= secondEndpoint ? firstEndpointType : secondEndpointType;
    const selectedUpperType =
      firstEndpoint > secondEndpoint ? firstEndpointType : secondEndpointType;

    // Check if answer is correct
    const correct =
      lowerSelected === quiz.lowerBound &&
      upperSelected === quiz.upperBound &&
      selectedLowerType === quiz.lowerCorrectType &&
      selectedUpperType === quiz.upperCorrectType;

    setResult(correct ? "✅ Correct!" : "❌ Try again!");
  };

  const nextQuestion = () => {
    setQuiz(generateQuestion());
    resetSelection();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Solve the compound inequality & graph it</h2>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{quiz.question}</p>

      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", cursor: "pointer" }}
        onClick={handleLineClick}
      >
        {/* Base number line */}
        <line
          x1={0}
          y1={40}
          x2={width}
          y2={40}
          stroke="black"
          strokeWidth="2"
        />

        {/* Tick marks */}
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const num = min + i;
          const x = scale(num);
          return (
            <g key={i}>
              <line x1={x} y1={35} x2={x} y2={45} stroke="black" />
              <text x={x - 4} y={60} fontSize="12">
                {num}
              </text>
            </g>
          );
        })}

        {/* Line segment between endpoints if both are selected */}
        {firstEndpoint !== null && secondEndpoint !== null && (
          <line
            x1={scale(Math.min(firstEndpoint, secondEndpoint))}
            y1={40}
            x2={scale(Math.max(firstEndpoint, secondEndpoint))}
            y2={40}
            stroke="blue"
            strokeWidth="4"
          />
        )}

        {/* First endpoint circle */}
        {firstEndpoint !== null && (
          <circle
            cx={scale(firstEndpoint)}
            cy={40}
            r={8}
            stroke="blue"
            strokeWidth="2"
            fill={firstEndpointType === "closed" ? "blue" : "white"}
            onClick={toggleFirstEndpointType}
            style={{ cursor: "pointer" }}
          />
        )}

        {/* Second endpoint circle */}
        {secondEndpoint !== null && (
          <circle
            cx={scale(secondEndpoint)}
            cy={40}
            r={8}
            stroke="blue"
            strokeWidth="2"
            fill={secondEndpointType === "closed" ? "blue" : "white"}
            onClick={toggleSecondEndpointType}
            style={{ cursor: "pointer" }}
          />
        )}
      </svg>

      <div style={{ marginTop: "10px", color: "#666" }}>
        {firstEndpoint === null ? (
          <p>👉 Click on the number line to select the first endpoint</p>
        ) : secondEndpoint === null ? (
          <p>👉 Click on the number line to select the second endpoint</p>
        ) : (
          <div>
            <p>
              ✅ Segment created between{" "}
              {Math.min(firstEndpoint, secondEndpoint)} and{" "}
              {Math.max(firstEndpoint, secondEndpoint)}
            </p>
            <button
              onClick={resetSelection}
              style={{
                padding: "5px 10px",
                background: "#999",
                color: "white",
                border: "none",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              Reset Selection
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={checkAnswer}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Check Answer
        </button>
        <button
          onClick={nextQuestion}
          style={{
            padding: "10px 20px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Next Question
        </button>
      </div>

      {result && (
        <p style={{ marginTop: "15px", fontSize: "18px", fontWeight: "bold" }}>
          {result}
        </p>
      )}
    </div>
  );
}
