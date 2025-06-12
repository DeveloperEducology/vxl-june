import React, { useState } from "react";
import { BlockMath } from "react-katex";
import { v4 as uuidv4 } from "uuid";
import 'katex/dist/katex.min.css';

const MathQuestionForm = () => {
  const [questionText, setQuestionText] = useState(
    "Solve the following equation for "
  );
  const [variable, setVariable] = useState("x");
  const [equation, setEquation] = useState("2x + \\frac{3}{4} = x^2");
  const [correctAnswer, setCorrectAnswer] = useState("1.5");
  const [jsonOutput, setJsonOutput] = useState("");
  const [copied, setCopied] = useState(false);
  // State for styles and nextObject for each piece
  const [styles, setStyles] = useState({
    questionText: { style: "row", nextObject: "continue-row" },
    variable: { style: "row", nextObject: "continue-row" },
    colon: { style: "row", nextObject: "continue-row" },
    equation: { style: "row", nextObject: "continue-row" },
    prompt: { style: "row", nextObject: "continue-row" },
    input: { style: "row", nextObject: "continue-row" },
  });

  const handleStyleChange = (pieceKey, field, value) => {
    setStyles((prev) => ({
      ...prev,
      [pieceKey]: { ...prev[pieceKey], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionObject = {
    //   _id: { $oid: uuidv4() },
      lessonId: "684a5b91248b2f20c8bc36a7",
      type: "EQUATION",
      pieces: [
        {
          objectType: "PlainText",
          text: questionText,
          style: styles.questionText.style,
          nextObject: styles.questionText.nextObject,
        },
        {
          objectType: "QMAlgebraic",
          latex: variable,
          children: [{ objectType: "PlainText", text: variable }],
          style: styles.variable.style,
          nextObject: styles.variable.nextObject,
        },
        {
          objectType: "PlainText",
          text: ": ",
          style: styles.colon.style,
          nextObject: styles.colon.nextObject,
        },
        {
          objectType: "QMEquation",
          latex: equation,
          children: [
            {
              objectType: "QMAlgebraic",
              children: [
                {
                  objectType: "PlainText",
                  text: equation.split("=")[0].trim(),
                },
              ],
            },
            { objectType: "PlainText", text: " = " },
            {
              objectType: "QMExponent",
              children: [
                { objectType: "PlainText", text: variable },
                { objectType: "PlainText", text: "2" },
              ],
            },
          ],
          style: styles.equation.style,
          nextObject: styles.equation.nextObject,
        },
        {
          objectType: "PlainText",
          text: ". Enter the positive solution: ",
          style: styles.prompt.style,
          nextObject: styles.prompt.nextObject,
        },
        {
          objectType: "QMInput",
          id: "input_1",
          correctAnswer: correctAnswer,
          style: styles.input.style,
          nextObject: styles.input.nextObject,
        },
      ],
    };
    setJsonOutput(JSON.stringify(questionObject, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Function to render a single piece based on its objectType
  const renderPiece = (piece, index) => {
    switch (piece.objectType) {
      case "PlainText":
        return <span key={index} className="text-gray-800">{piece.text}</span>;
      case "QMAlgebraic":
        return <BlockMath key={index} math={piece.latex} />;
      case "QMEquation":
        return <BlockMath key={index} math={piece.latex} />;
      case "QMInput":
        return (
          <input
            key={index}
            type="text"
            placeholder="Answer"
            className="p-1 border border-gray-300 rounded-md"
            disabled
          />
        );
      default:
        return null;
    }
  };

  // Render pieces with layout grouping
  const renderPieces = (pieces) => {
    const groupedPieces = [];
    let currentGroup = [];
    let currentContainerType = "row"; // Default to row

    pieces.forEach((piece, index) => {
      const isLastPiece = index === pieces.length - 1;
      const style = piece.style || "row";
      const nextObject = piece.nextObject || "continue-row";

      currentGroup.push({ ...piece, index });

      if (style === "column" || isLastPiece || nextObject === "new-column") {
        // Close the current group
        const containerClasses =
          currentContainerType === "row"
            ? "flex flex-row flex-wrap gap-2 items-center"
            : "flex flex-col gap-2";
        groupedPieces.push(
          <div key={`group-${index}`} className={containerClasses}>
            {currentGroup.map((p) => renderPiece(p, p.index))}
          </div>
        );
        // Start a new group
        currentGroup = [];
        currentContainerType = style === "column" ? "column" : "row";
      } else if (style === "row" && nextObject === "continue-row") {
        currentContainerType = "row";
      }
    });

    return groupedPieces;
  };

  // Define the pieces for preview
  const previewPieces = [
    {
      objectType: "PlainText",
      text: questionText,
      style: styles.questionText.style,
      nextObject: styles.questionText.nextObject,
    },
    {
      objectType: "QMAlgebraic",
      latex: variable,
      style: styles.variable.style,
      nextObject: styles.variable.nextObject,
    },
    {
      objectType: "PlainText",
      text: ": ",
      style: styles.colon.style,
      nextObject: styles.colon.nextObject,
    },
    {
      objectType: "QMEquation",
      latex: equation,
      style: styles.equation.style,
      nextObject: styles.equation.nextObject,
    },
    {
      objectType: "PlainText",
      text: ". Enter the positive solution: ",
      style: styles.prompt.style,
      nextObject: styles.prompt.nextObject,
    },
    {
      objectType: "QMInput",
      id: "input_1",
      correctAnswer: correctAnswer,
      style: styles.input.style,
      nextObject: styles.input.nextObject,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-5 p-5">
      <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-5">
          Math Question Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={styles.questionText.style}
                onChange={(e) =>
                  handleStyleChange("questionText", "style", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            {styles.questionText.style === "row" && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Object
                </label>
                <select
                  value={styles.questionText.nextObject}
                  onChange={(e) =>
                    handleStyleChange("questionText", "nextObject", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="continue-row">Continue in Row</option>
                  <option value="new-column">New Column</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variable
            </label>
            <input
              type="text"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="Enter variable (e.g., x)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={styles.variable.style}
                onChange={(e) =>
                  handleStyleChange("variable", "style", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            {styles.variable.style === "row" && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Object
                </label>
                <select
                  value={styles.variable.nextObject}
                  onChange={(e) =>
                    handleStyleChange("variable", "nextObject", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="continue-row">Continue in Row</option>
                  <option value="new-column">New Column</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equation (LaTeX)
            </label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="Enter equation in LaTeX"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={styles.equation.style}
                onChange={(e) =>
                  handleStyleChange("equation", "style", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            {styles.equation.style === "row" && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Object
                </label>
                <select
                  value={styles.equation.nextObject}
                  onChange={(e) =>
                    handleStyleChange("equation", "nextObject", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="continue-row">Continue in Row</option>
                  <option value="new-column">New Column</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Enter correct answer"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Input Style
              </label>
              <select
                value={styles.input.style}
                onChange={(e) =>
                  handleStyleChange("input", "style", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            {styles.input.style === "row" && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Object
                </label>
                <select
                  value={styles.input.nextObject}
                  onChange={(e) =>
                    handleStyleChange("input", "nextObject", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="continue-row">Continue in Row</option>
                  <option value="new-column">New Column</option>
                </select>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            Generate JSON
          </button>
        </form>
        {jsonOutput && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Generated JSON</h2>
              <button
                className="relative text-gray-600 hover:text-blue-600"
                onClick={handleCopy}
                title="Copy JSON"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {copied && (
                  <span className="absolute -top-6 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
      <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Question Preview</h2>
        <div className="p-4 bg-gray-100 rounded-md min-h-[60px] flex flex-col gap-2">
          {renderPieces(previewPieces)}
        </div>
      </div>
    </div>
  );
};

export default MathQuestionForm;