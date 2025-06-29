import { useState, useEffect } from "react";

export default function PictureAdditionQuiz({ lesson, onNext }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    setUserAnswers([]);
    setSubmitted(false);
    setFeedback([]);
  }, [lesson]);

  const handleInputChange = (index, value) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    const result = lesson.correctAnswer.map((ans, idx) =>
      userAnswers[idx]?.trim() === ans
        ? "✅ Correct"
        : `❌ Correct answer: ${ans}`
    );
    setFeedback(result);
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl transition-all duration-300 transform hover:scale-105">
      {/* Display Questions */}
      <div className="mb-6 space-y-4">
        {(() => {
          let inputIndex = 0;
          return lesson.text?.map((line, idx) => {
            const parts = line.split(/(null)/g);
            return (
              <p
                key={idx}
                className={`${
                  idx === 0
                    ? "text-lg font-medium text-gray-700"
                    : "text-xl font-bold text-green-800"
                }`}
              >
                {parts.map((part, i) => {
                  if (part === "null") {
                    const thisIndex = inputIndex++;
                    return (
                      <span key={`${idx}-${i}`}>
                        <input
                          type="text"
                          value={userAnswers[thisIndex] || ""}
                          onChange={(e) =>
                            handleInputChange(thisIndex, e.target.value)
                          }
                          disabled={submitted}
                          className={`inline-block w-16 mx-1 px-2 py-1 border-b-2 text-center text-lg border-gray-400 bg-transparent focus:outline-none ${
                            submitted
                              ? "bg-gray-100 text-gray-500"
                              : "focus:border-indigo-800"
                          }`}
                          placeholder="?"
                        />
                        {submitted && feedback[thisIndex] && (
                          <span
                            className={`ml-1 text-sm ${
                              feedback[thisIndex].startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {feedback[thisIndex]}
                          </span>
                        )}
                      </span>
                    );
                  } else {
                    return <span key={`${idx}-${i}`}>{part}</span>;
                  }
                })}
              </p>
            );
          });
        })()}
      </div>

      {/* Buttons */}
      {lesson.isLast ? null : (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            disabled={
              submitted ||
              userAnswers.length < lesson.correctAnswer.length ||
              userAnswers.some((a) => !a?.trim())
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              submitted ||
              userAnswers.length < lesson.correctAnswer.length ||
              userAnswers.some((a) => !a?.trim())
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Submit
          </button>

          <button
            onClick={onNext}
            disabled={!submitted}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              !submitted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
