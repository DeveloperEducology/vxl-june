import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { questionsGenerator } from "./utils/KidQnGntr";
import { FiVolume2 } from "react-icons/fi";
import { NumberLineQuestion } from "./utils/NumberLine";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const KidFriendlyPage = () => {
  const { topicKey } = useParams();
  const decodedKey = decodeURIComponent(topicKey);
  console.log("decodedKey", decodedKey);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]); // for number-line selection
  const [userAnswer, setUserAnswer] = useState(""); // input or mcq
  const [selectedAnswers, setSelectedAnswers] = useState([]); // mcq-multiple
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Generate question on load
  useEffect(() => {
    if (questionsGenerator[decodedKey]) {
      const generated = questionsGenerator[decodedKey]();
      setCurrentQuestion(generated);
    }
  }, [decodedKey]);

  // Read aloud utility
  //   const readAloud = (text) => {
  //     if ("speechSynthesis" in window) {
  //       const utterance = new SpeechSynthesisUtterance(text);
  //       window.speechSynthesis.speak(utterance);
  //     }
  //   };

  const readAloud = async (text) => {
  setIsSpeaking(true);
  try {
    const audio = await window.puter.ai.txt2speech(text, "en-US");
    audio.onended = () => setIsSpeaking(false);
    audio.play();
  } catch (err) {
    alert("TTS error");
    setIsSpeaking(false);
  }
};

  // Generate next question
  const generateNewQuestion = () => {
    const question = questionsGenerator[decodedKey]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setSelectedAnswers([]);
    setSelectedNumbers([]);
    setFeedback("");
    setShowResult(false);
    setUserAnswers([]);
  };

  console.log("currentQuestion", currentQuestion);

  const initializeUserAnswer = (currentQuestion) => {
    if (currentQuestion?.type === "sequence") {
      const nullCount =
        currentQuestion?.type === "sequence"
          ? currentQuestion?.sequences
            ? currentQuestion?.sequences.filter((item) => item === null).length
            : currentQuestion.correctAnswers.length
          : currentQuestion.question.reduce(
              (count, str) => count + (str.match(/null/g) || []).length,
              0
            );
      return Array(nullCount).fill("");
    }
    return "";
  };

  // Handle submit logic
  const handleSubmit = () => {
    if (!currentQuestion) return;

    const { type, answer, questionType } = currentQuestion;
    const correctAnswers = Array.isArray(answer) ? answer : [answer];

    // Validation
    const isEmpty =
      (type === "input" && !userAnswer) ||
      (type === "mcq" && !userAnswer) ||
      (type === "mcq-multiple" && selectedAnswers.length === 0) ||
      (type === "number-line" && selectedNumbers.length === 0);

    if (isEmpty) {
      setFeedback("⚠️ Please provide an answer before submitting");
      return;
    }

    let isCorrect = false;
    let feedbackMessage = "";

    switch (type) {
      case "mcq-multiple":
        isCorrect =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((ans) => selectedAnswers.includes(ans));
        feedbackMessage = isCorrect
          ? "🎉 Perfect! All correct answers selected!"
          : `❌ Oops! Correct answers were: ${correctAnswers.join(", ")}`;
        break;

      case "number-line":
        const missed = correctAnswers.filter(
          (n) => !selectedNumbers.includes(n)
        );
        const extras = selectedNumbers.filter(
          (n) => !correctAnswers.includes(n)
        );
        isCorrect = missed.length === 0 && extras.length === 0;

        feedbackMessage = isCorrect
          ? `🎉 Perfect! All ${questionType} numbers correct!`
          : `❌ ${
              questionType === "even" ? "Even" : "Odd"
            } Number Practice:\n` +
            (missed.length > 0
              ? `Missed ${questionType} numbers: ${missed.join(", ")}\n`
              : "") +
            (extras.length > 0
              ? `Incorrect selections: ${extras.join(", ")}\n`
              : "") +
            `Correct ${questionType} numbers: ${correctAnswers.join(
              ", "
            )}\n\n` +
            `Tip: ${
              questionType === "even"
                ? "Even numbers end with 0, 2, 4, 6, or 8"
                : "Odd numbers end with 1, 3, 5, 7, or 9"
            }`;
        break;

      case "input":
      case "mcq":
        isCorrect =
          userAnswer.toString().toLowerCase() ===
          correctAnswers[0].toString().toLowerCase();
        feedbackMessage = isCorrect
          ? "🎉 Correct! Great job!"
          : `❌ Not quite! The correct answer was: ${correctAnswers.join(
              ", "
            )}`;
        break;
      case "sequence":
        const userSequenceAnswers = userAnswers[currentQuestion._id] || [];

        isCorrect =
          currentQuestion?.correctAnswers.length ===
            userSequenceAnswers.length &&
          currentQuestion?.correctAnswers.every(
            (correctAns, i) =>
              correctAns.toString().trim() ===
              (userSequenceAnswers[i] ?? "").toString().trim()
          );

        feedbackMessage = isCorrect
          ? "🎉 Well done! You completed the sequence correctly!"
          : `❌ Not quite. Correct numbers were: ${correctAnswers.join(", ")}`;

        break;

      default:
        feedbackMessage = "⚠️ Unknown question type";
        break;
    }

    setFeedback(feedbackMessage);
    setShowResult(true);
    setTotalQuestions((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    }
  };

  // Handle multi-select toggle
  const handleMultipleSelect = (option) => {
    setSelectedAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((ans) => ans !== option)
        : [...prev, option]
    );
  };

  const handleAnswerChange = (e, index) => {
    const value = e.target.value; // always string
    const prevSequenceAnswers =
      userAnswers[currentQuestion._id] || initializeUserAnswer(currentQuestion);
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion._id]: newSequenceAnswers,
    });
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(null);
    setUserAnswer("");
    setSelectedAnswers([]);
    setSelectedNumbers([]);
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
    setFeedback("");
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

      case "sequence":
        const parsedSequence =
          typeof currentQuestion.sequences[0] === "string"
            ? currentQuestion.sequences[0]
                .split(" ")
                .map((v) => (v.toLowerCase() === "null" ? null : v))
            : currentQuestion.sequences;

        return (
          <div className="flex items-center flex-wrap gap-2">
            {parsedSequence.map((item, index) => {
              if (item === null) {
                const nullIndex = parsedSequence
                  .slice(0, index)
                  .filter((i) => i === null).length;
                return (
                  <input
                    key={index}
                    type="number"
                    value={
                      (userAnswers[currentQuestion._id] || [])[nullIndex] ?? ""
                    }
                    onChange={(e) => handleAnswerChange(e, nullIndex)}
                    className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder=""
                  />
                );
              }
              return (
                <span key={index} className="mr-1">
                  {item}
                  {index < parsedSequence.length - 1 ? "," : ""}
                </span>
              );
            })}
          </div>
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
      case "true_false":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex gap-6 justify-center">
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
    if (decodedKey === "🔢 Even Number Hunt") {
      return (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-blue-50 rounded-lg">
          {currentQuestion.visuals.map((visual, i) => (
            <div
              key={i}
              className={`text-4xl p-3  rounded-lg ${
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
    if (decodedKey === "A.1 Skip-Counting-by-pictures") {
      return (
        <div className="flex flex-wrap justify-left gap-4 text-3xl p-4 bg-purple-50 rounded-lg">
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
      {" "}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={resetQuiz}
            className="text-sm text-purple-600 hover:underline font-semibold"
          >
            {/* ← Back to Topics */}
          </button>
          <div className="text-base text-gray-700 bg-white/50 px-3 py-1 rounded-full">
            Score: <span className="font-bold text-purple-700">{score}</span> /{" "}
            {totalQuestions}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl space-y-6">
          <h2 className="text-mg font-bold text-left text-purple-700">
            {decodedKey}
          </h2>

          <p className="text-xl text-center whitespace-pre-wrap text-gray-800 min-h-[4rem] flex items-center justify-left">
            <button
              onClick={() => readAloud(currentQuestion?.question)}
              className="mr-2 text-xl text-purple-600 hover:text-purple-800 transition-colors"
              aria-label="Read aloud"
            >
              <FiVolume2 />
            </button>
            <div>
              {currentQuestion?.passage && (
                <div className="mb-4">
                  <h3 className="text-gray-700 font-semibold mb-2">Passage:</h3>
                  <div className="bg-white/70 rounded-md p-3 border border-gray-200 text-gray-800 text-md">
                    <ReactMarkdown>{currentQuestion.passage}</ReactMarkdown>
                  </div>
                </div>
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentQuestion?.question}
              </ReactMarkdown>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => (
                    <table className="w-auto border border-gray-400 border-collapse mx-auto my-4 text-sm">
                      {props.children}
                    </table>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gray-100 text-center text-[14px]">
                      {props.children}
                    </thead>
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b border-gray-300 text-center">
                      {props.children}
                    </tr>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-400 px-2 py-1 font-semibold min-w-[100px]">
                      {props.children}
                    </th>
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-gray-300 px-2 py-1">
                      {props.children}
                    </td>
                  ),
                }}
              >
                {currentQuestion?.table}
              </ReactMarkdown>
            </div>
          </p>

          {renderVisuals()}

          <div className="flex justify-left">{renderQuestionInput()}</div>

          {!showResult ? (
            <div className="text-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={
                  (currentQuestion?.type === "input" && !userAnswer) ||
                  (currentQuestion?.type === "mcq" && !userAnswer) ||
                  (currentQuestion?.type === "true_false" && !userAnswer) ||
                  (currentQuestion?.type === "mcq-multiple" &&
                    selectedAnswers?.length === 0)
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
      </div>
    </div>
  );
};

export default KidFriendlyPage;
