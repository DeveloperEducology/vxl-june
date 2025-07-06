import React, { useState, useEffect } from "react";

export default function Multiplication({ lesson }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const getRandomFromRange = (range) => {
    if (Array.isArray(range) && range.length === 2) {
      const [min, max] = range;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return null;
  };

  const generateQuestion = () => {
    const aRange = lesson?.numbers?.a;
    const bRange = lesson?.numbers?.b;

    const num1 =
      getRandomFromRange(aRange) ?? Math.floor(Math.random() * 12) + 1;
    const num2 =
      getRandomFromRange(bRange) ?? Math.floor(Math.random() * 12) + 1;
    const correctAnswer = num1 * num2;

    // Generate 3 incorrect options
    let options = new Set();
    while (options.size < 3) {
      const offset = Math.floor(Math.random() * 21) - 10;
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
        options.add(wrongAnswer);
      }
    }

    options = [...options];
    options.push(correctAnswer);
    options.sort(() => 0.5 - Math.random());

    setQuestion({
      stem: `What is the product of ${num1} and ${num2}?`,
      number: `${num1} × ${num2} = `,
      correctAnswer,
      options,
    });

    setSelectedAnswer(null);
    setFeedback("");
  };

  useEffect(() => {
    if (lesson?.numbers) {
      generateQuestion();
    }
  }, [lesson]);

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);
    if (option === question.correctAnswer) {
      setFeedback("✅ Correct!");
      setTimeout(() => {
        generateQuestion();
      }, 1000); // Generate next question after 1 second
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `❌ Incorrect! The correct answer is ${question.correctAnswer}`
      );
    }
    setAttempts((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex justify-center p-4">
      <div className="bg-white p-6 w-full">
          <p className="text-green-600 font-semibold mb-7">
          Score: {score} | Attempts: {attempts}
        </p>
        {question && (
          <>
            <h1 className="text-2xl font-bold text-left mb-4 text-gray-800">
              Math Multiplication
            </h1>
            <p className="text-lg font-medium text-left mb-4">
              {question.stem}
            </p>
            <p className="text-2xl font-medium text-left mb-4">
              {question.number}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`py-3 px-4 rounded-lg text-lg font-semibold transition-all ${
                    selectedAnswer === option
                      ? option === question.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : selectedAnswer
                      ? option === question.correctAnswer
                        ? "bg-green-200 text-gray-700"
                        : "bg-gray-200 text-gray-500"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`text-center py-2 mb-4 rounded-lg font-semibold ${
                  feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              
              {feedback.startsWith("❌") && (
                <button
                  onClick={generateQuestion}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Next Question
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
