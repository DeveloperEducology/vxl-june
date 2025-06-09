import React from "react";

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

    switch (expression.objectType) {
      case "PlainText":
        return (
          <span key={`${questionId}-${index}`} style={styles.questionText}>
            {expression.text || ""}
          </span>
        );

      case "QMDecimal":
        return (
          <span key={`${questionId}-${index}`} style={{ fontFamily: "serif" }}>
            {expression.nonRepeatingPart || ""}
          </span>
        );

      case "QMInput":
        const userValue = answers[questionId]?.[expression.id] || "";
        const correctAnswer = expression.correctAnswer || "";
        const isCorrect = submitted && userValue === correctAnswer;
        const isIncorrect = submitted && userValue !== correctAnswer;

        return (
          <input
            key={`${questionId}-${expression.id}`}
            type="text"
            style={{
              width: `${Math.max(correctAnswer.length * 10, 40)}px`,
              height: "28px",
              textAlign: "center",
              border: submitted
                ? isCorrect
                  ? "2px solid #4CAF50"
                  : "2px solid #F44336"
                : "1px solid #9E9E9E",
              margin: "0 4px",
              padding: "0 5px",
              borderRadius: "4px",
              backgroundColor: isCorrect
                ? "#E8F5E9"
                : isIncorrect
                ? "#FFEBEE"
                : "white",
              fontFamily: "monospace",
              fontSize: "16px",
              verticalAlign: "middle",
            }}
            value={userValue}
            onChange={(e) =>
              handleInputChange(questionId, expression.id, e.target.value)
            }
            disabled={submitted}
          />
        );

      case "QMFraction":
        return (
          <div
            key={`${questionId}-${index}`}
            style={{
              display: "inline-block",
              textAlign: "center",
              verticalAlign: "middle",
              margin: "0 4px",
              fontFamily: "serif",
            }}
          >
            <div style={{ padding: "0 5px" }}>
              {renderExpression(
                expression.children?.[0],
                questionId,
                `${index}-num`
              ) || "?"}
            </div>
            <div
              style={{
                borderTop: "1px solid black",
                padding: "0 5px",
              }}
            >
              {renderExpression(
                expression.children?.[1],
                questionId,
                `${index}-den`
              ) || "?"}
            </div>
          </div>
        );

      case "QMExponent":
        return (
          <span
            key={`${questionId}-${index}`}
            style={{ position: "relative", fontFamily: "serif" }}
          >
            {renderExpression(
              expression.children?.[0],
              questionId,
              `${index}-base`
            ) || "?"}
            <span
              style={{
                fontSize: "0.7em",
                verticalAlign: "super",
                position: "absolute",
                top: "-0.5em",
              }}
            >
              {renderExpression(
                expression.children?.[1],
                questionId,
                `${index}-exponent`
              ) || "?"}
            </span>
          </span>
        );

      case "QMAlgebraic":
        return (
          <span
            key={`${questionId}-${index}`}
            style={{
              display: "inline-block",
              fontFamily: "serif",
              margin: "0 2px",
            }}
          >
            {expression.children?.map((child, i) =>
              renderExpression(child, questionId, `${index}-${i}`)
            ) || "Empty"}
          </span>
        );

      case "QMEquation":
        return (
          <div
            key={`${questionId}-${index}`}
            style={{
              margin: "15px 0",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              borderLeft: "4px solid #3f51b5",
            }}
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
            dangerouslySetInnerHTML={{ __html: expression.content || "" }}
            style={{
              display: "inline-block",
              margin: "5px 0",
              lineHeight: "1.6",
            }}
          />
        );

      default:
        console.warn("Unknown expression type:", expression.objectType);
        return (
          <span key={`${questionId}-${index}`} style={{ color: "red" }}>
            Unsupported type: {expression.objectType}
          </span>
        );
    }
  };

  if (!question?._id) {
    return <div style={{ color: "red" }}>Missing question ID.</div>;
  }

  if (!question?.pieces || !Array.isArray(question.pieces)) {
    return <div style={{ color: "red" }}>Invalid math question format.</div>;
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "25px",
        color: "#333",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          lineHeight: "1.8",
          marginBottom: "30px",
          minHeight: "120px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {question.pieces.map((piece, index) =>
          renderExpression(piece, question.id, index)
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => onSubmit(question)}
          style={{
            padding: "12px 24px",
            backgroundColor: submitted ? "#78909C" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.3s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          disabled={submitted}
        >
          {submitted ? "✓ Submitted" : "Submit Answer"}
        </button>

        <button
          onClick={() => onReset()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#F44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          disabled={!submitted}
        >
          Reset
        </button>
      </div>

      {submitted && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            borderLeft:
              "4px solid " +
              (score.correct === score.total
                ? "#4CAF50"
                : score.percentage >= 70
                ? "#FFC107"
                : "#F44336"),
          }}
        >
          <div
            style={{
              fontWeight: "600",
              marginBottom: "10px",
              fontSize: "18px",
              color: "#2c3e50",
            }}
          >
            {score.correct === score.total
              ? "✅ Perfect! All answers correct!"
              : score.percentage >= 70
              ? "👍 Good job! You got most answers right!"
              : "❌ Some answers need correction."}
          </div>
          <div style={{ fontSize: "16px" }}>
            Score: {score.correct} out of {score.total} correct (
            {score.percentage}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleMathQuiz;
