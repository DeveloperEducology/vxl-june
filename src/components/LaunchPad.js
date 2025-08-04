import React, { useMemo, useState } from "react";
import DomainQuestionSVG from "./DomainQuestionSVG";
import FunctionGraphQuiz from "./FunctionGraphQuiz";
import QuizTemplate from "./QuizTemplate";
import QuizRenderer from "./QuizRenderer";

import { data } from "./Data";

// ✅ Utility to generate random points
function generateRandomPoints(count = 4, min = -5, max = 5) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    const y = Math.floor(Math.random() * (max - min + 1)) + min;
    points.push([x, y]);
  }
  return points;
}

export default function LaunchPad() {
  const [index, setIndex] = React.useState(0);

  // ✅ Generate random points once
  const randomPoints = useMemo(() => generateRandomPoints(4), []);

  // ✅ Dropdown state for selected quiz type
  const [selectedQuiz, setSelectedQuiz] = useState("domain");

  // ✅ Renders the correct quiz component
  const renderQuizComponent = () => {
    switch (selectedQuiz) {
      case "domain":
        return <DomainQuestionSVG points={randomPoints} />;
      case "functionGraph":
        return <FunctionGraphQuiz points={randomPoints} />;
      case "graph":
        return (
          <QuizTemplate
            range={10} // grid 1..5
            gridSize={{ x: 50, y: 30 }} // spacing
            questionCount={8} // number of questions
            showHints={true} // show dashed hint line
          />
        );
      case "NewGraph":
        return (
          <div>
            <QuizRenderer question={data[index]} />
            <button
              onClick={() => setIndex((prev) => (prev + 1) % data.length)}
            >
              Next Question
            </button>
          </div>
        );

      default:
        return <p>Select a quiz type</p>;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ✅ Dropdown selection */}
      <label style={{ marginRight: "10px" }}>Choose Quiz Type:</label>
      <select
        value={selectedQuiz}
        onChange={(e) => setSelectedQuiz(e.target.value)}
      >
        <option value="domain">Domain Question</option>
        <option value="functionGraph">Function Graph Quiz</option>
        <option value="graph">Graph Quiz</option>
        <option value="NewGraph">New Graph</option>
      </select>

      {/* <hr style={{ margin: "20px 0" }} /> */}

      {/* ✅ Render selected quiz */}
      {renderQuizComponent()}
    </div>
  );
}
