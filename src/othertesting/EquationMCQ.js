import { useState, useEffect } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FiVolume2 } from "react-icons/fi";

// Utility to transform question pieces into renderable parts
const transformPieces = (pieces) =>
  pieces
    .map((piece) => {
      if (piece.objectType === "PlainText") {
        return { type: "text", content: piece.text };
      } else if (
        ["QMEquation", "QMAlgebraic", "QMExponent"].includes(piece.objectType)
      ) {
        return { type: "math", content: piece.latex };
      } else if (piece.objectType === "QMInput") {
        return {
          type: "input",
          id: piece.id,
          correctAnswer: piece.correctAnswer,
        };
      }
      return null;
    })
    .filter(Boolean);

export default function EquationMCQ({
  lesson,
  userAnswer,
  setUserAnswer,
  onSubmit,
  onNext,
}) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showSolution, setShowSolution] = useState(false);

  const questionParts = transformPieces(lesson.pieces); // Text + math + inputs
  const options = lesson.options || [];

  const hasInputField = questionParts.some((p) => p.type === "input");

  // Shuffle options on load
  useEffect(() => {
    setFeedback("");
    setSubmitted(false);
    setShuffledOptions([...options].sort(() => Math.random() - 0.5));
  }, [lesson]);

  const handleOptionSelect = (value) => {
    if (!submitted && !hasInputField) {
      setUserAnswer(value);
    }
  };

  const handleInputChange = (e, id) => {
    if (!submitted) {
      setUserAnswer({ ...userAnswer, [id]: e.target.value });
    }
  };

  const handleSubmit = () => {
    let isCorrect = false;
    let correctAnswerSummary = "";

    if (hasInputField) {
      // Evaluate input-based answers
      const correctInputs = questionParts
        .filter((p) => p.type === "input")
        .map((p) => ({
          id: p.id,
          correct: p.correctAnswer,
        }));

      const totalCorrect = correctInputs.length;
      const correctCount = correctInputs.filter(
        (input) =>
          userAnswer?.[input.id]?.toString() === input.correct.toString()
      ).length;

      isCorrect = correctCount === totalCorrect;
      correctAnswerSummary = correctInputs
        .map((i) => `${i.id}: ${i.correct}`)
        .join(", ");
      setShowSolution(true);
      setFeedback(
        isCorrect
          ? "✅ Correct!"
          : `❌ Incorrect. Correct answer: ${correctAnswerSummary}`
      );
    } else {
      // Evaluate multiple-choice answer
      const correctOption = options.find((opt) => opt.isCorrect);
      isCorrect =
        userAnswer === correctOption.latex || userAnswer === correctOption.text;
      correctAnswerSummary = correctOption.latex || correctOption.text;

      setFeedback(
        isCorrect
          ? "✅ Correct!"
          : `❌ Incorrect. Correct answer: ${correctOption.latex}`
      );
    }
    setShowSolution(true);
    setSubmitted(true);
    onSubmit(isCorrect, userAnswer, correctAnswerSummary);

    if (isCorrect) {
      setTimeout(() => {
        onNext(isCorrect, userAnswer, correctAnswerSummary);
      }, 1500);
    }
  };

  console.log("lesson", lesson);

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Question Parts */}
      <div className="text-lg text-gray-800 flex flex-wrap items-center">
        {questionParts.map((part, index) => (
          <span key={index} className="mx-1">
            {part.type === "text" && (
              <>
                {index === 0 && (
                  <button
                    onClick={() => readAloud(part.content)}
                    className="mr-2 text-xl"
                    aria-label="Read aloud"
                  >
                    <FiVolume2 size={24} />
                  </button>
                )}
                {part.content}
              </>
            )}
            {part.type === "math" && <InlineMath math={part.content} />}
            {part.type === "input" && (
              <input
                type="text"
                value={userAnswer?.[part.id] || ""}
                onChange={(e) => handleInputChange(e, part.id)}
                disabled={submitted}
                placeholder="?"
                className="inline-block mx-1 px-2 py-1 border-b-2 border-gray-500 w-16 text-center bg-transparent"
              />
            )}
          </span>
        ))}
      </div>

      {/* Options (if no input fields) */}
      {!hasInputField && options.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() =>
                readAloud(
                  options.map((opt) => opt.latex || opt.text).join(", ")
                )
              }
              className="text-xl"
              aria-label="Read all options"
            >
              <FiVolume2 size={24} />
            </button>
            <span className="text-sm text-gray-500">Read all options</span>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            {shuffledOptions.map((opt, idx) => {
              const isSelected =
                userAnswer === opt.latex || userAnswer === opt.text;
              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => handleOptionSelect(opt.latex || opt.text)}
                  className={`px-4 py-2 rounded-md border text-sm transition-colors min-w-[100px] text-center ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-white border-gray-300 hover:bg-blue-100"
                  } ${submitted ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  {opt.latex ? <InlineMath math={opt.latex} /> : opt.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {feedback && <div className="mt-4 text-lg font-medium">{feedback}</div>}

      {showSolution &&
        Array.isArray(lesson.solution) &&
        lesson.solution.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Solution</h3>
            <div className="text-gray-700">
              {lesson.solution.map((part, index) => (
                <span key={index} className="block">
                  <BlockMath math={part} />
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              hasInputField
                ? !Object.values(userAnswer || {}).every((v) => v !== "")
                : !userAnswer
            }
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              hasInputField
                ? Object.values(userAnswer || {}).every((v) => v !== "")
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
                : userAnswer
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        )}

        {submitted &&
          // Only allow Next if feedback does NOT start with ❌, otherwise just show the button but don't call onNext
          (feedback.startsWith("❌") ? (
            <button
              className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              onClick={onNext}
            >
              Ok, Next Question
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Next
            </button>
          ))}
      </div>
    </div>
  );
}
