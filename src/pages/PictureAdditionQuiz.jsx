import { useState, useEffect } from "react";

export default function PictureAdditionQuiz({
  lesson,
  userAnswer,
  setUserAnswer,
  onSubmit,
  onNext,
}) {
  const [feedback, setFeedback] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFeedback([]);
    setSubmitted(false);
  }, [lesson]);

  const handleChange = (index, value) => {
    const current = Array.isArray(userAnswer) ? [...userAnswer] : [];
    while (current.length <= index) {
      current.push("");
    }
    current[index] = value;
    setUserAnswer(current);
  };

  const handleSubmit = () => {
    const isCorrect =
      JSON.stringify(userAnswer.map((a) => a.trim())) ===
      JSON.stringify(lesson.correctAnswer);
    const result = lesson.correctAnswer.map((ans, idx) =>
      userAnswer?.[idx]?.trim() === ans
        ? "✅ Correct"
        : `❌ Correct answer: ${ans}`
    );
    setFeedback(result);
    setSubmitted(true);
    onSubmit(isCorrect, userAnswer);
  };

  // Input index for multiple blanks
  let inputIndex = 0;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4 w-full max-w-2xl mx-auto">
      {/* Show Title */}
      {lesson.title && (
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {lesson.title}
        </h2>
      )}

      {/* Show Illustration Emojis (Big) in a row */}
      {lesson.illustration && lesson.illustration.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 sm:gap-6 items-left justify-left text-5xl sm:text-4xl leading-snug font-normal">
          {lesson.illustration.map((line, idx) => (
            <span
              key={`illustration-${idx}`}
              style={{
                // backgroundColor: "#bbbfb8",
                padding: 2,
                borderRadius: 5,
                margin: 2,
                display: "inline-block",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                cursor: "pointer",
                MozWindowDragging: 'drag',
              }}
            >
              {line}
            </span>
          ))}
        </div>
      )}

      {/* Show Question with Inputs */}
      {lesson.text?.map((line, idx) => {
        const parts = line.split(/(null)/g);
        const isEmojiLine = /^[^a-zA-Z0-9\n]*$/.test(line.trim());

        return (
          <p
            key={`text-${idx}`}
            className={`flex flex-wrap items-center ${
              isEmojiLine
                ? "text-4xl sm:text-6xl leading-snug text-left"
                : "text-lg sm:text-xl font-semibold"
            }`}
          >
            {parts.map((part, i) => {
              if (part === "null") {
                const index = inputIndex++;
                return (
                  <input
                    key={i}
                    value={userAnswer?.[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={submitted}
                    className="w-12 sm:w-16 border-b-2 mx-1 sm:mx-2 text-center text-xl sm:text-2xl"
                    placeholder="?"
                  />
                );
              } else {
                return <span key={i}>{part}</span>;
              }
            })}
          </p>
        );
      })}

      {/* Feedback */}
      {feedback.map((msg, idx) => (
        <p
          key={idx}
          className={`text-xs sm:text-sm ${
            msg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      ))}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              !userAnswer ||
              userAnswer.length < lesson.correctAnswer.length ||
              userAnswer.some((a) => !a?.trim())
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto"
          >
            Submit
          </button>
        )}

        {submitted && (
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full sm:w-auto"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
