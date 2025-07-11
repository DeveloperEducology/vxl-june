import React, { useState } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function EquationRenderer({ pieces }) {
  const [inputs, setInputs] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const renderPiece = (piece, idx) => {
    switch (piece.renderAs) {
      case "text":
        return <span key={idx}>{piece.text}</span>;
      case "math":
        return <InlineMath key={idx} math={piece.text} />;
      case "input":
        const userAnswer = inputs[piece.id] || "";
        const isCorrect = submitted && userAnswer === piece.correctAnswer;
        return (
          <input
            key={idx}
            type="text"
            value={userAnswer}
            placeholder="?"
            className={`mx-2 border-b w-16 text-center ${
              submitted ? (isCorrect ? "text-green-600" : "text-red-600") : ""
            }`}
            onChange={(e) => handleInputChange(piece.id, e.target.value)}
            disabled={submitted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-md text-xl text-gray-800">
      <div className="flex flex-wrap items-center gap-1">
        {pieces.map((piece, idx) => renderPiece(piece, idx))}
      </div>
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      )}
    </div>
  );
}
