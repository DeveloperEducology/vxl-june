import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { questionsGenerator } from "./utils/questionGenerator";

const MathQuiz = () => {
  const { topicKey } = useParams();
  const decodedTopic = decodeURIComponent(topicKey);
  console.log("decodedTopic", decodedTopic);

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (questionsGenerator[decodedTopic]) {
      const generated = Array.from({ length: 5 }, () =>
        questionsGenerator[decodedTopic]()
      );
      setQuestions(generated);
    }
  }, [decodedTopic]);

  const handleMCQClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (
      (Array.isArray(current.answer) && current.answer.includes(option)) ||
      option === current.answer
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const handleInputSubmit = () => {
    if (inputAnswer === "") return;
    const correct =
      String(current.answer).trim().toLowerCase() ===
      inputAnswer.trim().toLowerCase();
    if (correct) setScore((prev) => prev + 1);
    setSelectedOption(true);
  };

  const handleNext = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setInputAnswer("");
    } else {
      setShowResult(true);
    }
  };

  if (!questions.length) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>🧠 Quiz: {decodedTopic}</h2>
        <p>⚠️ No question generator found for this topic.</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#fef6e4",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          margin: "2rem",
        }}
      >
        <h2 style={{ fontSize: "2rem" }}>🎉 Yay! You finished the quiz!</h2>
        <p style={{ fontSize: "1.4rem" }}>Topic: {decodedTopic}</p>
        <p style={{ fontSize: "1.5rem", color: "#4caf50" }}>
          ✅ Your Score: <strong>{score}</strong> / {questions.length}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.8rem 1.5rem",
            backgroundColor: "#ffb703",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          🔁 Try Again
        </button>
      </div>
    );
  }

  const current = questions[currentQIndex];

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "#fff7e6",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: "2rem" }}>
        🧠 {decodedTopic}
      </h2>
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        Question {currentQIndex + 1} of {questions.length}
      </p>

      <div
        style={{
          margin: "1.5rem 0",
          fontSize: "1.4rem",
          textAlign: "center",
        }}
      >
        <strong>❓ {current.question}</strong>
      </div>

      {/* Display visuals */}
      {current.visuals && current.visuals.length > 0 && (
        <div
          style={{
            margin: "1rem 0",
            display: "flex",
            gap: "0.7rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {current.visuals.map((v, i) => (
            <span
              key={i}
              style={{
                padding: "0.6rem 1rem",
                fontSize: "1.6rem",
                backgroundColor: "#fff0f6",
                borderRadius: "10px",
                border: "2px dashed #ff69b4",
              }}
            >
              {v.content || v}
            </span>
          ))}
        </div>
      )}

      {/* MCQ & Multiple */}
      {(current.type === "mcq" || current.type === "mcq-multiple") && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
        >
          {current.options.map((option, i) => {
            const isCorrect = Array.isArray(current.answer)
              ? current.answer.includes(option)
              : option === current.answer;

            const isSelected = option === selectedOption;

            let bg = "#f0f0f0";
            if (selectedOption) {
              if (isSelected && isCorrect) bg = "#d4edda";
              else if (isSelected && !isCorrect) bg = "#f8d7da";
              else if (isCorrect) bg = "#cce5ff";
            }

            return (
              <button
                key={i}
                onClick={() => handleMCQClick(option)}
                disabled={!!selectedOption}
                style={{
                  padding: "0.9rem 1.2rem",
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                  border: "2px solid #ccc",
                  backgroundColor: bg,
                  cursor: selectedOption ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Input question */}
      {current.type === "input" && !selectedOption && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            placeholder="Type your answer here"
            style={{
              padding: "0.8rem",
              fontSize: "1.1rem",
              width: "80%",
              border: "2px solid #ffa07a",
              borderRadius: "10px",
              textAlign: "center",
            }}
          />
          <br />
          <button
            onClick={handleInputSubmit}
            style={{
              marginTop: "1rem",
              padding: "0.8rem 1.2rem",
              backgroundColor: "#ffa500",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            ✅ Submit
          </button>
        </div>
      )}

      {/* Show correct answer */}
      {selectedOption && current.type === "input" && (
        <div
          style={{
            marginTop: "1rem",
            fontSize: "1.2rem",
            textAlign: "center",
            color: "#007bff",
          }}
        >
          Correct Answer: <strong>{current.answer}</strong>
        </div>
      )}

      {/* Next Button */}
      {selectedOption && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={handleNext}
            style={{
              padding: "0.9rem 1.5rem",
              backgroundColor: "#4caf50",
              color: "#fff",
              fontSize: "1.2rem",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            {currentQIndex + 1 === questions.length ? "🎉 Finish" : "➡️ Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MathQuiz;
