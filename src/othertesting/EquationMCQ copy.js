import { useState, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// Utility: Transforms structured lesson content into render-friendly format
const transformPieces = (pieces) =>
  pieces
    .map((piece) => {
      if (piece.objectType === "PlainText") {
        return { renderAs: "text", text: piece.text };
      } else if (
        piece.objectType === "QMEquation" ||
        piece.objectType === "QMAlgebraic" ||
        piece.objectType === "QMExponent"
      ) {
        return { renderAs: "math", text: piece.latex };
      } else if (piece.objectType === "QMInput") {
        return {
          renderAs: "input",
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
  const content = transformPieces(lesson.pieces);
  const options = lesson.options || [];
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  //   console.log("Lesson Content:", content);

  // For multiple input fields support
  const isInputArray = Array.isArray(userAnswer);
  const getInputValue = (id) =>
    isInputArray
      ? userAnswer.find((ans) => ans?.id === id)?.value || ""
      : userAnswer || "";

  const updateInputValue = (id, value) => {
    if (isInputArray) {
      const updated = userAnswer.map((ans) =>
        ans.id === id ? { ...ans, value } : ans
      );
      setUserAnswer(updated);
    } else {
      setUserAnswer(value);
    }
  };

  useEffect(() => {
    setFeedback("");
    setSubmitted(false);
    setShuffledOptions([...options].sort(() => Math.random() - 0.5));
  }, [lesson]);

  const handleSubmit = () => {
    let isCorrect = false;
    let correctAnswer = "";

    const inputs = isInputArray
      ? userAnswer
      : [{ id: "input", value: userAnswer }];

    isCorrect = content
      .filter((c) => c.renderAs === "input")
      .every((c) => {
        const input = inputs.find((i) => i.id === c.id);
        return input && input.value.trim() === c.correctAnswer;
      });

    correctAnswer = content
      .filter((c) => c.renderAs === "input")
      .map((c) => c.correctAnswer)
      .join(", ");

    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. Correct answer: ${correctAnswer}`
    );

    setSubmitted(true);
    onSubmit(isCorrect, userAnswer, correctAnswer);

    // Automatically go to next question if correct
    if (isCorrect) {
      setTimeout(() => {
        onNext();
      }, 1500);
    }
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  console.log(userAnswer, "User Answer");

  return (
    <div className="space-y-5">
      {/* Render question parts */}
      <div className="text-xl text-gray-800 flex flex-row font-medium items-center flex-wrap">
        {content.map((piece, idx) => {
          if (piece.renderAs === "text") {
            return (
              <span key={idx} className="mx-1 flex items-center">
                {idx === 0 && (
                  <button
                    onClick={() => readAloud(piece.text)}
                    className="mr-2 text-xl"
                  >
                    🔉
                  </button>
                )}
                {piece.text}
              </span>
            );
          } else if (piece.renderAs === "math") {
            return (
              <span key={idx} className="mx-1 flex items-center">
                <InlineMath math={piece.text} />
              </span>
            );
          } else if (piece.renderAs === "input") {
            return (
              <input
                key={piece.id}
                type="text"
                value={getInputValue(piece.id)}
                onChange={(e) => updateInputValue(piece.id, e.target.value)}
                disabled={submitted}
                placeholder="?"
                className="mx-2 px-2 py-1 border-b-2 text-lg text-center border-gray-500 w-20 bg-transparent"
              />
            );
          }
          return null;
        })}
      </div>
      {/* Read all options aloud */}
      {options.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => readAloud(options.map((opt) => opt.text).join(", "))}
            className="text-xl"
          >
            🔉
          </button>
          <span className="text-sm text-gray-500">Read all options</span>
        </div>
      )}

      {/* Options as buttons */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {shuffledOptions.map((opt, idx) => {
            const isSelected = userAnswer === opt.text;
            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => !submitted && setUserAnswer(opt.text)}
                className={`px-4 py-2 rounded-md min-w-[100px] text-sm border text-center transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-400 text-white"
                    : "bg-white border-blue-300 text-gray-800 hover:bg-indigo-100"
                } ${submitted ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <InlineMath math={opt.text} />
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {/* Show Next button only if incorrect */}
      {submitted && !feedback.startsWith("✅") && (
        <button
          onClick={onNext}
          className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Next
        </button>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              !userAnswer ||
              (Array.isArray(userAnswer) && userAnswer.some((i) => !i.value))
            }
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              !userAnswer ||
              (Array.isArray(userAnswer) &&
                userAnswer.some((i) => !i.value?.trim()))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Submit
          </button>
        )}
        {submitted && (
          <button
            onClick={onNext}
            className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}


