import React, { useState, useEffect } from "react";

// ✅ Random smooth function-like curve in all quadrants
const generateBezierCurve = () => {
  const points = [
    { x: -80, y: Math.random() * 80 - 40 },
    { x: -40, y: Math.random() * 80 - 40 },
    { x: 0, y: Math.random() * 80 - 40 },
    { x: 40, y: Math.random() * 80 - 40 },
    { x: 80, y: Math.random() * 80 - 40 },
  ];
  let path = `M ${points[0].x},${-points[0].y}`; // flip Y for SVG
  for (let i = 1; i < points.length; i++) {
    const midX = (points[i - 1].x + points[i].x) / 2;
    const midY = (points[i - 1].y + points[i].y) / 2;
    path += ` Q ${midX},${-midY} ${points[i].x},${-points[i].y}`;
  }
  return path;
};

// ✅ Logarithmic-like curve in random quadrant
const generateLogCurve = () => {
  const flipX = Math.random() < 0.5 ? 1 : -1; // flip horizontally
  const flipY = Math.random() < 0.5 ? 1 : -1; // flip vertically
  let path = "";
  for (let i = 1; i <= 80; i += 4) {
    const x = flipX * i;
    const y = flipY * (30 + Math.log(i + 1) * 15);
    if (i === 1) path += `M ${x},${-y}`;
    else path += ` L ${x},${-y}`;
  }
  return path;
};

// ✅ Parabola-like curve in random orientation
const generateParabolaCurve = () => {
  const flipX = Math.random() < 0.5 ? 1 : -1;
  const flipY = Math.random() < 0.5 ? 1 : -1;
  let path = "";
  for (let x = -50; x <= 50; x += 2) {
    const y = flipY * (0.02 * x * x - 20); // parabola
    const svgX = flipX * x;
    if (x === -50) path += `M ${svgX},${-y}`;
    else path += ` L ${svgX},${-y}`;
  }
  return path;
};

// ❌ Circle (NOT a function)
const generateCirclePath = () => {
  const cx = (Math.random() * 60 - 30).toFixed(1); // random center X
  const cy = (Math.random() * 60 - 30).toFixed(1); // random center Y
  const r = 20 + Math.random() * 15; // random radius
  return `M ${cx - r},${-cy}
          a ${r},${r} 0 1,0 ${2 * r},0
          a ${r},${r} 0 1,0 -${2 * r},0`;
};

export default function FunctionGraphQuiz() {
  const [curve, setCurve] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(true);
  const [answer, setAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const generateNewQuestion = () => {
    const shapeChoices = ["bezier", "log", "parabola", "circle"];
    const randomShape =
      shapeChoices[Math.floor(Math.random() * shapeChoices.length)];

    if (randomShape === "bezier") {
      setCurve(generateBezierCurve());
      setCorrectAnswer(true);
    } else if (randomShape === "log") {
      setCurve(generateLogCurve());
      setCorrectAnswer(true);
    } else if (randomShape === "parabola") {
      setCurve(generateParabolaCurve());
      setCorrectAnswer(true);
    } else if (randomShape === "circle") {
      setCurve(generateCirclePath());
      setCorrectAnswer(false);
    }

    setAnswer(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const checkAnswer = (userAnswer) => {
    setAnswer(userAnswer);
    setIsCorrect(userAnswer === correctAnswer);
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Look at this graph:</h2>

      <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
        <svg
          viewBox="-100 -100 200 200"
          style={{
            width: "100%",
            height: "auto",
            border: "1px solid #ccc",
            background: "white",
          }}
        >
          {/* ✅ Grid pattern */}
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="lightgray"
                strokeWidth="0.3"
              />
            </pattern>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <rect width="50" height="50" fill="url(#smallGrid)" />
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="gray"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>

          {/* ✅ Background grid */}
          <rect x="-100" y="-100" width="200" height="200" fill="url(#grid)" />

          {/* ✅ Axes (crossing in middle) */}
          <line x1="-100" y1="0" x2="100" y2="0" stroke="black" strokeWidth="1" />
          <line x1="0" y1="-100" x2="0" y2="100" stroke="black" strokeWidth="1" />

          {/* ✅ Axis arrows */}
          <polygon points="100,0 95,-3 95,3" fill="black" />
          <polygon points="0,100 -3,95 3,95" fill="black" />

          {/* ✅ Axis labels */}
          <text x="92" y="-5" fontSize="6" fill="black">
            x
          </text>
          <text x="5" y="95" fontSize="6" fill="black">
            y
          </text>

          {/* ✅ Curve (can appear in any quadrant) */}
          <path d={curve} stroke="blue" fill="none" strokeWidth="2" />
        </svg>
      </div>

      <p>Is this relation a function?</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={() => checkAnswer(true)}>Yes</button>
        <button onClick={() => checkAnswer(false)}>No</button>
      </div>

      {answer !== null && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
        </p>
      )}

      <button
        style={{
          marginTop: "1rem",
          padding: "8px 16px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={generateNewQuestion}
      >
        Next Question
      </button>
    </div>
  );
}
