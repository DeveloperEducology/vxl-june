import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const SingleMathQuiz = ({
  question,
  answers,
  setAnswers,
  submitted,
  onSubmit,
  onReset,
  score,
}) => {
  const handleInputChange = (questionId, inputId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [inputId]: value,
      },
    }));
  };

  const renderExpression = (expression, questionId, index) => {
    if (!expression) return null;

    try {
      const fontSize = expression.fontSize
        ? `${expression.fontSize}px`
        : "16px";
      const style = { fontSize };

      switch (expression.objectType) {
        case "PlainText":
          return (
            <span
              key={`${questionId}-${index}`}
              className="text-gray-800"
              style={style}
            >
              {expression.text || ""}
            </span>
          );

        case "QMInput":
          const userValue = answers[questionId]?.[expression.id] || "";
          const correctAnswer = String(expression.correctAnswer || "").trim();
          const isCorrect =
            submitted && String(userValue).trim() === correctAnswer;
          const isIncorrect = submitted && !isCorrect;

          return (
            <input
              key={`${questionId}-${expression.id}`}
              type="text"
              placeholder={expression.placeholder || "Enter answer"}
              className={`w-16 h-7 text-center border mx-1 p-1 rounded focus:outline-none ${
                submitted
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-400"
              }`}
              value={userValue}
              onChange={(e) =>
                handleInputChange(questionId, expression.id, e.target.value)
              }
              disabled={submitted}
              style={style}
            />
          );

        case "QMFraction":
          if (expression.latex) {
            return (
              <span key={`${questionId}-${index}`} className="align-middle">
                <InlineMath math={expression.latex} />
              </span>
            );
          }

          return (
            <div
              key={`${questionId}-${index}`}
              className="inline-block text-center align-middle mx-1 font-serif"
            >
              <div className="px-1">
                {renderExpression(
                  expression.children?.[0],
                  questionId,
                  `${index}-num`
                ) || "?"}
              </div>
              <div className="border-t border-black px-1">
                {renderExpression(
                  expression.children?.[1],
                  questionId,
                  `${index}-den`
                ) || "?"}
              </div>
            </div>
          );

        case "QMEquation":
          if (expression.latex) {
            return (
              <BlockMath
                key={`${questionId}-${index}`}
                math={expression.latex}
                style={style}
              />
            );
          }

          return (
            <div
              key={`${questionId}-${index}`}
              className="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-600"
            >
              {expression.children?.map((child, i) =>
                renderExpression(child, questionId, `${index}-${i}`)
              )}
            </div>
          );

        default:
          console.warn("Unknown expression type:", expression.objectType);
          return (
            <span key={`${questionId}-${index}`} className="text-red-500">
              Unsupported type: {expression.objectType}
            </span>
          );
      }
    } catch (error) {
      console.error("Error rendering expression:", expression, error);
      return (
        <span key={`${questionId}-${index}`} className="text-red-500">
          Error rendering {expression?.objectType || "unknown"}
        </span>
      );
    }
  };

  const renderPieces = () => {
    const groupedPieces = [];
    let currentGroup = [];

    // Helper to determine layout direction
    const getLayoutStyle = () => {
      return question.layoutStyle === "column" ? "column" : "row";
    };

    question.pieces.forEach((piece, index) => {
      currentGroup.push({ ...piece, index });

      // Group until nextObject is new-column or end of array
      if (
        index === question.pieces.length - 1 ||
        piece.nextObject === "new-column"
      ) {
        const layoutStyle = getLayoutStyle();

        groupedPieces.push(
          <div
            key={`group-${index}`}
            className={`flex ${
              layoutStyle === "column"
                ? "flex-col items-start gap-2"
                : "flex-row items-center gap-4"
            }`}
          >
            {currentGroup.map((p) =>
              renderExpression(p, question._id, p.index)
            )}
          </div>
        );
        currentGroup = [];
      }
    });

    return groupedPieces;
  };

  if (!question?._id) {
    return <div className="text-red-500">Missing question ID.</div>;
  }

  if (!question?.pieces || !Array.isArray(question.pieces)) {
    return <div className="text-red-500">Invalid math question format.</div>;
  }

  return (
    <div className="font-sans max-w-3xl mx-auto p-6 text-gray-800">
      {/* Question Box */}
      <div className="text-4xl leading-8 mb-8 min-h-[120px] p-5 bg-white rounded-lg shadow-sm">
        {renderPieces()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={() => onSubmit(question)}
          className={`px-6 py-3 rounded-lg text-white font-medium shadow-sm transition-colors ${
            submitted ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={submitted}
        >
          {submitted ? "✓ Submitted" : "Submit Answer"}
        </button>
        <button
          onClick={() => onReset()}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium shadow-sm hover:bg-red-600 transition-colors"
          disabled={!submitted}
        >
          Reset
        </button>
      </div>

      {/* Score Display */}
      {submitted && (
        <div
          className={`mt-6 p-5 bg-gray-100 rounded-lg border-l-4 ${
            score.correct === score.total
              ? "border-green-500"
              : score.percentage >= 70
              ? "border-yellow-500"
              : "border-red-500"
          }`}
        >
          <div className="font-semibold mb-2 text-lg text-gray-900">
            {score.correct === score.total
              ? "✅ Perfect! All answers correct!"
              : score.percentage >= 70
              ? "👍 Good job! You got most answers right!"
              : "❌ Some answers need correction."}
          </div>
          <div className="text-base">
            Score: {score.correct} out of {score.total} correct (
            {score.percentage}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMathQuiz;
