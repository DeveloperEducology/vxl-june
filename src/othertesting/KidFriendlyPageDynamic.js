import React, { useState, useRef, useEffect } from "react";
import { FiVolume2 } from "react-icons/fi";
import { questionsGenerator } from "./utils/KidQnGntr";

function NumberLineQuestion({ question, onAnswer, showResult, key }) {
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberClick = (number) => {
    if (showResult) return;
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  useEffect(() => {
    if (!showResult) {
      onAnswer(selectedNumbers);
    }
  }, [selectedNumbers, showResult]);

  const width = 400;
  const height = 100;
  const padding = 50;

  const numberPositions = question.numbers.map((num, i) => {
    const x =
      padding + i * ((width - 2 * padding) / (question.numbers.length - 1));
    return { number: num, x };
  });

  return (
    <div className="flex flex-col items-center mt-6">
      <svg width={width} height={height} className="border-b-2 border-gray-400">
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke="black"
          strokeWidth="2"
        />

        {numberPositions.map(({ number, x }) => {
          const isTarget = question.answer.includes(number);
          const isSelected = selectedNumbers.includes(number);

          return (
            <g
              key={number}
              onClick={() => handleNumberClick(number)}
              className="cursor-pointer"
            >
              <line
                x1={x}
                y1={height / 2 - 10}
                x2={x}
                y2={height / 2 + 10}
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={x}
                y={height / 2 + 30}
                textAnchor="middle"
                fontSize="16"
                fill={showResult && isTarget ? "green" : "black"}
              >
                {number}
              </text>

              {isSelected && (
                <circle
                  cx={x}
                  cy={height / 2}
                  r="8"
                  fill={showResult ? (isTarget ? "green" : "red") : "blue"}
                />
              )}

              {showResult && isTarget && !isSelected && (
                <circle
                  cx={x}
                  cy={height / 2}
                  r="8"
                  fill="none"
                  stroke="green"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </g>
          );
        })}
      </svg>

      {showResult && (
        <div className="mt-4 text-center space-y-2">
          {selectedNumbers.every((n) => question.answer.includes(n)) &&
          selectedNumbers.length === question.answer.length ? (
            <div className="text-green-600 font-bold">
              Perfect! All {question.questionType} numbers selected correctly!
            </div>
          ) : (
            <>
              {selectedNumbers.some((n) => !question.answer.includes(n)) && (
                <div className="text-red-600">
                  Incorrect selections:{" "}
                  {selectedNumbers
                    .filter((n) => !question.answer.includes(n))
                    .join(", ")}
                </div>
              )}
              {question.answer.some((n) => !selectedNumbers.includes(n)) && (
                <div className="text-yellow-600">
                  Missed {question.questionType} numbers:{" "}
                  {question.answer
                    .filter((n) => !selectedNumbers.includes(n))
                    .join(", ")}
                </div>
              )}
            </>
          )}
          <div className="text-gray-700">
            Remember: {question.questionType} numbers{" "}
            {question.questionType === "even"
              ? "are divisible by 2 (0, 2, 4, etc.)"
              : "are not divisible by 2 (1, 3, 5, etc.)"}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KidFriendlyPageDynamic() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Added for multiple selection

  const topicKeys = Object.keys(questionsGenerator);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    const question = questionsGenerator[topic]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setSelectedAnswers([]);
    setSelectedAnswers([]);
    setShowResult(false);
    setFeedback("");
  };

  const generateNewQuestion = () => {
    const question = questionsGenerator[selectedTopic]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setShowResult(false);
    setSelectedAnswers([]);
    setSelectedAnswers([]);
    setFeedback("");
  };

  console.log("currentQuestion", currentQuestion);

  const handleSubmit = () => {
    // Validate all question types
    if (
      (currentQuestion.type === "input" && !userAnswer) ||
      (currentQuestion.type === "mcq" && !userAnswer) ||
      (currentQuestion.type === "mcq-multiple" &&
        selectedAnswers.length === 0) ||
      (currentQuestion.type === "number-line" &&
        (!userAnswer || userAnswer.length === 0))
    ) {
      setFeedback("⚠️ Please provide an answer before submitting");
      return;
    }

    let isCorrect = false;
    let feedbackMessage = "";
    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : [currentQuestion.answer];
    const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

    switch (currentQuestion.type) {
      case "mcq-multiple":
        isCorrect =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((ans) => selectedAnswers.includes(ans));
        feedbackMessage = isCorrect
          ? "🎉 Perfect! All correct answers selected!"
          : `❌ Oops! Correct answers were: ${correctAnswers.join(", ")}`;
        break;

      case "number-line":
        const missedNumbers = correctAnswers.filter(
          (n) => !userAnswer.includes(n)
        );
        const extraNumbers = userAnswer.filter(
          (n) => !correctAnswers.includes(n)
        );

        isCorrect = missedNumbers.length === 0 && extraNumbers.length === 0;

        if (isCorrect) {
          feedbackMessage = `🎉 Perfect! All ${currentQuestion.questionType} numbers correct!`;
        } else {
          feedbackMessage = `❌ ${
            currentQuestion.questionType === "even" ? "Even" : "Odd"
          } Number Practice:\n`;

          if (missedNumbers.length > 0) {
            feedbackMessage += `Missed ${
              currentQuestion.questionType
            } numbers: ${missedNumbers.join(", ")}\n`;
          }

          if (extraNumbers.length > 0) {
            feedbackMessage += `Incorrect selections: ${extraNumbers.join(
              ", "
            )}\n`;
          }

          feedbackMessage += `The ${
            currentQuestion.questionType
          } numbers were: ${correctAnswers.join(", ")}`;

          // Add educational tip
          feedbackMessage += `\n\nTip: ${
            currentQuestion.questionType === "even"
              ? "Even numbers end with 0, 2, 4, 6, or 8"
              : "Odd numbers end with 1, 3, 5, 7, or 9"
          }`;
        }
        break;

      case "input":
      case "mcq":
        isCorrect =
          userAnswer.toString().toLowerCase() ===
          currentQuestion.answer.toString().toLowerCase();
        feedbackMessage = isCorrect
          ? "🎉 Correct! Great job!"
          : `❌ Not quite! The answer was: ${correctAnswers.join(", ")}`;
        break;

      default:
        isCorrect = false;
        feedbackMessage = "⚠️ Unknown question type";
    }

    setFeedback(feedbackMessage);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    }
    setTotalQuestions((prev) => prev + 1);
    setShowResult(true);
  };

  const handleMultipleSelect = (option) => {
    setSelectedAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setCurrentQuestion(null);
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
    setFeedback("");
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "input":
        return (
          <input
            type={currentQuestion?.textType === "text" ? "text" : "number"}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            disabled={showResult}
            className="w-full max-w-xs text-center text-xl border-2 border-purple-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
            autoComplete="off"
          />
        );
      case "mcq":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex flex-wrap gap-6 justify-center">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswer === option;
                const isCorrect =
                  showResult && option === currentQuestion.answer;
                const isWrong =
                  showResult && isSelected && option !== currentQuestion.answer;

                return (
                  <button
                    key={option}
                    onClick={() => setUserAnswer(option)}
                    disabled={showResult}
                    className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-2 transition-all min-w-[100px]
                ${isCorrect ? "bg-green-200 border-green-500" : ""}
                ${isWrong ? "bg-red-200 border-red-500" : ""}
                ${
                  isSelected && !showResult
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : ""
                }
                ${
                  !isSelected && !showResult
                    ? "bg-white border-gray-300 hover:border-purple-300"
                    : ""
                }
                ${showResult ? "opacity-100" : ""}
              `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showResult && userAnswer && currentQuestion.feedbackPerOption && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Feedback:</strong>{" "}
                {currentQuestion.feedbackPerOption[userAnswer]}
              </div>
            )}
          </div>
        );

      case "mcq-multiple":
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleMultipleSelect(option)}
                disabled={showResult}
                className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-4 transition-all ${
                  selectedAnswers.includes(option)
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : "bg-white border-gray-300 hover:border-purple-300"
                } ${showResult ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "number-line":
        return (
          <NumberLineQuestion
            question={currentQuestion}
            onAnswer={(selected) => setUserAnswer(selected)}
            showResult={showResult}
            key={totalQuestions}
          />
        );
      default:
        return null;
    }
  };

  const renderVisuals = () => {
    if (!currentQuestion?.visuals || currentQuestion.visuals.length === 0) {
      return null;
    }
    if (selectedTopic === "🔢 Even Number Hunt") {
      return (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-blue-50 rounded-lg">
          {currentQuestion.visuals.map((visual, i) => (
            <div
              key={i}
              className={`text-4xl p-3 rounded-lg ${
                currentQuestion.answer.includes(visual.content) && showResult
                  ? "bg-green-100 border-2 border-green-400"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              {visual.content}
            </div>
          ))}
        </div>
      );
    }
    // Special styling for Skip-Counting Adventure
    if (selectedTopic === "🍭 Skip-Counting Adventure") {
      return (
        <div className="flex flex-wrap justify-center gap-4 text-3xl p-4 bg-purple-50 rounded-lg">
          {currentQuestion.visuals.map((group, i) => (
            <div
              key={i}
              className="p-2 border-2 border-dashed border-purple-200 rounded-md"
            >
              {group}
            </div>
          ))}
        </div>
      );
    }

    // Default visual styling for others like "Even or Odd"
    return (
      <div className="flex flex-wrap justify-center gap-3 text-4xl p-4 bg-yellow-50 rounded-lg">
        {currentQuestion.visuals.map((emoji, i) => (
          <span key={i}>{emoji}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 font-sans p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {!selectedTopic ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-purple-700 drop-shadow-md">
              🎓 Math Playground
            </h1>
            <p className="text-center text-lg text-gray-600 mb-8">
              Tap a topic and let’s learn!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topicKeys.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-white/70 backdrop-blur-sm border-4 border-purple-200 rounded-3xl p-6 text-xl text-purple-800 font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={resetQuiz}
                className="text-sm text-purple-600 hover:underline font-semibold"
              >
                ← Back to Topics
              </button>
              <div className="text-base text-gray-700 bg-white/50 px-3 py-1 rounded-full">
                Score:{" "}
                <span className="font-bold text-purple-700">{score}</span> /{" "}
                {totalQuestions}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl space-y-6">
              <h2 className="text-mg font-bold text-left text-purple-700">
                {selectedTopic}
              </h2>

              <p className="text-xl text-center whitespace-pre-wrap text-gray-800 min-h-[4rem] flex items-center justify-left">
                <button
                  onClick={() => readAloud(currentQuestion?.question)}
                  className="mr-2 text-xl text-purple-600 hover:text-purple-800 transition-colors"
                  aria-label="Read aloud"
                >
                  <FiVolume2 />
                </button>
                {currentQuestion?.question}
              </p>
              {/* <h1 className="justify-center">{currentQuestion?.prompt}</h1> */}

              {renderVisuals()}

              <div className="flex justify-left">{renderQuestionInput()}</div>

              {!showResult ? (
                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (currentQuestion.type === "input" && !userAnswer) ||
                      (currentQuestion.type === "mcq" && !userAnswer) ||
                      (currentQuestion.type === "mcq-multiple" &&
                        selectedAnswers.length === 0)
                    }
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Submit Answer
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 pt-4">
                  <div
                    className={`p-4 rounded-xl text-xl font-bold ${
                      feedback.includes("Yay")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {feedback}
                  </div>
                  <button
                    onClick={generateNewQuestion}
                    className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    👉 Next Question
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
