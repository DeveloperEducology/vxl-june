import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const styles = {
  questionText: {
    marginBottom: "10px",
  },
};

const SingleMathQuiz = ({
  question,
  answers,
  setAnswers,
  submitted,
  onSubmit,
  onReset,
  score,
  onNext,
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

  const flattenExpressions = (expressions) => {
    if (!expressions || !Array.isArray(expressions)) return [];
    return expressions.flatMap((expr) =>
      expr && expr.children
        ? [expr, ...flattenExpressions(expr.children)]
        : expr
        ? [expr]
        : []
    );
  };

  const renderExpression = (expression, questionId, index) => {
    if (!expression) {
      console.warn("Null expression at index:", index);
      return null;
    }

    try {
      switch (expression.objectType) {
        case "PlainText":
          return (
            <span key={`${questionId}-${index}`} className="text-gray-800 mb-2">
              {expression.text || ""}
            </span>
          );

        case "QMDecimal":
          return (
            <span key={`${questionId}-${index}`} className="font-serif">
              {expression.nonRepeatingPart || ""}
            </span>
          );

        case "QMInput":
          const userValue = answers[questionId]?.[expression.id] || "";
          const correctAnswer = String(expression.correctAnswer || "").trim();
          const isCorrect =
            submitted && String(userValue).trim() === correctAnswer;
          const isIncorrect =
            submitted && String(userValue).trim() !== correctAnswer;

          console.log("QMInput validation:", {
            questionId,
            inputId: expression.id,
            userValue,
            correctAnswer,
            isCorrect,
          });

          return (
            <input
              key={`${questionId}-${expression.id}`}
              type="text"
              className={`w-${Math.max(
                correctAnswer.length * 2,
                10
              )} h-7 text-center border ${
                submitted
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-gray-400"
              } mx-1 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base align-middle`}
              value={userValue}
              onChange={(e) =>
                handleInputChange(questionId, expression.id, e.target.value)
              }
              disabled={submitted}
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

        case "QMExponent":
          if (expression.latex) {
            return (
              <span key={`${questionId}-${index}`} className="align-middle">
                <InlineMath math={expression.latex} />
              </span>
            );
          }
          return (
            <span
              key={`${questionId}-${index}`}
              className="relative font-serif"
            >
              {renderExpression(
                expression.children?.[0],
                questionId,
                `${index}-base`
              ) || "?"}
              <span className="text-sm align-super absolute -top-2">
                {renderExpression(
                  expression.children?.[1],
                  questionId,
                  `${index}-exponent`
                ) || "?"}
              </span>
            </span>
          );

        case "QMAlgebraic":
          if (expression.latex) {
            return (
              <span key={`${questionId}-${index}`} className="align-middle">
                <InlineMath math={expression.latex} />
              </span>
            );
          }
          return (
            <span
              key={`${questionId}-${index}`}
              className="inline-block font-serif mx-0.5"
            >
              {expression.children?.map((child, i) =>
                renderExpression(child, questionId, `${index}-${i}`)
              ) || "Empty"}
            </span>
          );
        case "QMAlgebraic":
        case "QMEquation":
          if (expression.latex) {
            return (
              <div
                key={`${questionId}-${index}`}
                className="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-600"
              >
                <BlockMath math={expression.latex} />
              </div>
            );
          }
          return (
            <div
              key={`${questionId}-${index}`}
              className="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-600"
            >
              {expression.children?.map((child, i) =>
                renderExpression(child, questionId, `${index}-${i}`)
              ) || "Empty"}
            </div>
          );

        case "QMHTML":
          return (
            <div
              key={`${questionId}-${index}`}
              className="inline-block my-1 leading-6"
              dangerouslySetInnerHTML={{ __html: expression.content || "" }}
            />
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
          Error rendering {expression.objectType}
        </span>
      );
    }
  };

  const renderPieces = (pieces) => {
    const groupedPieces = [];
    let currentGroup = [];
    let currentContainerType = "row";

    pieces.forEach((piece, index) => {
      const isLastPiece = index === pieces.length - 1;
      const style = piece.style || "row";
      const nextObject = piece.nextObject || "continue-row";

      currentGroup.push({ ...piece, index });

      if (style === "column" || isLastPiece || nextObject === "new-column") {
        const containerClasses =
          currentContainerType === "row"
            ? "flex flex-row flex-wrap gap-2 items-center"
            : "flex flex-col gap-2";
        groupedPieces.push(
          <div key={`group-${index}`} className={containerClasses}>
            {currentGroup.map((p) =>
              renderExpression(p, question._id, p.index)
            )}
          </div>
        );
        currentGroup = [];
        currentContainerType = style === "column" ? "column" : "row";
      } else if (style === "row" && nextObject === "continue-row") {
        currentContainerType = "row";
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
      <div className="text-4xl leading-8 mb-8 min-h-[120px] p-5 bg-white rounded-lg shadow-sm">
        {renderPieces(question.pieces)}
      </div>

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
