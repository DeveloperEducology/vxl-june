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

  // Move inputIndex outside the map to keep it global
  let inputIndex = 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      {lesson.text.map((line, idx) => {
        const parts = line.split(/(null)/g);
        return (
          <p key={idx} className="text-xl font-semibold">
            {parts.map((part, i) => {
              if (part === "null") {
                const index = inputIndex++;
                return (
                  <input
                    key={i}
                    value={userAnswer?.[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={submitted}
                    className="w-16 border-b-2 mx-2 text-center"
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

      {feedback.map((msg, idx) => (
        <p
          key={idx}
          className={`text-sm ${
            msg.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      ))}

      <div className="flex gap-4 mt-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              !userAnswer ||
              userAnswer.length < lesson.correctAnswer.length ||
              userAnswer.some((a) => !a?.trim())
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        )}

        {submitted && (
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
