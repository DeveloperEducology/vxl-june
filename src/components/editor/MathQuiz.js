import React, { useState, useEffect } from "react";
import read from "../assets/read.png";

const styles = {
  questionText: {
    marginBottom: "10px",
  },
  inputField: {
    padding: "5px",
    margin: "10px 0",
  },
};

const MathQuiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Set random question index on component mount
  useEffect(() => {
    // const randomIndex = Math.floor(Math.random() * questions.length);
    // setCurrentQuestionIndex(randomIndex);
  }, [questions?.length]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleInputChange = (questionId, inputId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [inputId]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const currentAnswers = answers[currentQuestion.id] || {};
    const inputs = flattenExpressions(currentQuestion.pieces).filter(
      (expr) => expr.objectType === "QMInput"
    );

    const correctCount = inputs.filter(
      (input) => currentAnswers[input.id] === input.correctAnswer
    ).length;

    setScore({
      correct: correctCount,
      total: inputs.length,
      percentage: Math.round((correctCount / inputs.length) * 100) || 0,
    });
    setSubmitted(true);
  };

  const handleNext = () => {
    setAnswers({});
    setCurrentQuestionIndex((prev) => prev + 1);
    setSubmitted(false);
  };

  // Text-to-speech
  const [isReading, setIsReading] = useState(false);

  // Function to extract readable text from expressions
  const getReadableText = (expression) => {
    if (!expression) return "";

    switch (expression.objectType) {
      case "PlainText":
        return expression.text || "";
      case "QMDecimal":
        return expression.nonRepeatingPart || "";
      case "QMInput":
        return "[Input]";
      case "QMFraction":
        return `${getReadableText(
          expression.children[0]
        )} over ${getReadableText(expression.children[1])}`;
      case "QMExponent":
        return `${getReadableText(
          expression.children[0]
        )} to the power ${getReadableText(expression.children[1])}`;
      case "QMAlgebraic":
      case "QMEquation":
        return (
          expression.children
            ?.map((child) => getReadableText(child))
            .join(" ") || ""
        );
      case "QMHTML":
        // Strip HTML tags for plain text
        return expression.content.replace(/<[^>]+>/g, "") || "";
      default:
        return "";
    }
  };

  const readAloud = () => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      // Combine text from all pieces
      const textToRead = currentQuestion?.pieces
        .map((piece) => getReadableText(piece))
        .join(" ");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderExpression = (expression, questionId, index) => {
    if (!expression) return null;

    switch (expression.objectType) {
      case "PlainText":
        return (
          <span key={`${questionId}-${index}`} style={styles.questionText}>
            {expression.text}
          </span>
        );

      case "QMDecimal":
        return (
          <span key={`${questionId}-${index}`} style={{ fontFamily: "serif" }}>
            {expression.nonRepeatingPart}
          </span>
        );

      case "QMInput":
        const userValue = answers[questionId]?.[expression.id] || "";
        const correctAnswer = expression.correctAnswer;
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
                expression.children[0],
                questionId,
                `${index}-num`
              )}
            </div>
            <div
              style={{
                borderTop: "1px solid black",
                padding: "0 5px",
              }}
            >
              {renderExpression(
                expression.children[1],
                questionId,
                `${index}-den`
              )}
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
              expression.children[0],
              questionId,
              `${index}-base`
            )}
            <span
              style={{
                fontSize: "0.7em",
                verticalAlign: "super",
                position: "absolute",
                top: "-0.5em",
              }}
            >
              {renderExpression(
                expression.children[1],
                questionId,
                `${index}-exponent`
              )}
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
            )}
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
            )}
          </div>
        );

      case "QMHTML":
        return (
          <div
            key={`${questionId}-${index}`}
            dangerouslySetInnerHTML={{ __html: expression.content }}
            style={{
              margin: "5px 0",
              lineHeight: "1.6",
            }}
          />
        );

      default:
        console.warn("Unknown expression type:", expression.objectType);
        return null;
    }
  };

  const flattenExpressions = (expressions) => {
    return expressions.flatMap((expr) => {
      if (expr.children) {
        return [expr, ...flattenExpressions(expr.children)];
      }
      return expr;
    });
  };

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
          marginBottom: "25px",
          fontSize: "20px",
          fontWeight: "600",
          color: "#2c3e50",
        }}
      >
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

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
        <button
          onClick={readAloud}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            // backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isReading}
        >
          <img
            src={read}
            alt="Read Aloud"
            style={{
              width: "30px",
              height: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </button>
        {currentQuestion?.pieces.map((piece, index) =>
          renderExpression(piece, currentQuestion.id, index)
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 24px",
            backgroundColor: submitted ? "#78909C" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            flex: "1",
            transition: "background-color 0.3s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          disabled={submitted}
        >
          {submitted ? "✓ Submitted" : "Submit Answer"}
        </button>

        {submitted && questions.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              flex: "1",
              transition: "background-color 0.3s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Next Question →
          </button>
        )}
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

export default MathQuiz;
