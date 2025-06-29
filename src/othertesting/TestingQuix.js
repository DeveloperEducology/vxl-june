import { useState } from "react";

export default function TesingQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const lessons = [
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: [
        "Add the following cars",
        "🚗🚗🚗🚗 + 🚗🚗🚗🚗 = 🚗🚗🚗🚗🚗🚗🚗🚗",
        "null + null = null",
      ],
      type: "picture-addition",
      correctAnswer: ["4", "4", "8"],
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: [
        "Add the following rabbits",
        "1. 🐇🐇🐇🐇 = null",
        "2. 🐇🐇🐇🐇 + 🐇🐇🐇🐇 = null",
        "3. 🐇🐇🐇🐇 + 🐇🐇🐇🐇 + 🐇🐇🐇🐇 = null",
      ],
      type: "picture-addition",
      correctAnswer: ["4", "8", "12"],
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: [
        "Add the following rabbits",
        "1. 🐇🐇 = null",
        "2. 🐇🐇 + 🐇🐇 = null",
        "3. 🐇🐇 + 🐇🐇 + 🐇🐇 = null",
      ],
      type: "picture-addition",
      correctAnswer: ["2", "4", "6"],
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: [
        "Add the following cars",
        "1. 🚗🚗🚗🚗🚗 = null",
        "2. 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 = null",
        "3. 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 = null",
        "4. 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 = null",
        "5. 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 + 🚗🚗🚗🚗🚗 = null",
      ],
      type: "picture-addition",
      correctAnswer: ["5", "10", "15", "20", "25"],
    },
  ];

  const currentLesson = lessons[currentQuestionIndex];

  const handleInputChange = (index, value) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    const result = currentLesson.correctAnswer.map((ans, idx) =>
      userAnswers[idx]?.trim() === ans
        ? "✅ Correct"
        : `❌ Correct answer: ${ans}`
    );
    setFeedback(result);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < lessons.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswers([]);
      setSubmitted(false);
      setFeedback([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl transition-all duration-300 transform hover:scale-105">
        {/* Display Questions */}
        <div className="mb-6 space-y-4">
          {(() => {
            let inputIndex = 0;
            return currentLesson.text.map((line, idx) => {
              const parts = line.split(/(null)/g); // Split at each "null"
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
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            disabled={
              submitted ||
              userAnswers.length < currentLesson.correctAnswer.length ||
              userAnswers.some((a) => !a?.trim())
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              submitted ||
              userAnswers.length < currentLesson.correctAnswer.length ||
              userAnswers.some((a) => !a?.trim())
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Submit
          </button>

          <button
            onClick={handleNext}
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
      </div>
    </div>
  );
}
