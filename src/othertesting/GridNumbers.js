import React, { useState } from "react";

const GridExerciseQuiz = () => {
  const questions = [
    {
      hundreds: 5,
      tens: 2,
      ones: 3,
      answer: 523,
      explanation: "5 hundreds (500) + 2 tens (20) + 3 ones (3) = 523",
    },
    {
      hundreds: 2,
      tens: 4,
      ones: 3,
      answer: 243,
      explanation: "2 hundreds (200) + 4 tens (40) + 3 ones (3) = 243",
    },
    {
      hundreds: 4,
      tens: 6,
      ones: 2,
      answer: 462,
      explanation: "4 hundreds (400) + 6 tens (60) + 2 ones (2) = 462",
    },
    {
      hundreds: 6,
      tens: 5,
      ones: 5,
      answer: 655,
      explanation: "6 hundreds (600) + 5 tens (50) + 5 ones (5) = 655",
    },
    {
      hundreds: 7,
      tens: 2,
      ones: 3,
      answer: 723,
      explanation: "7 hundreds (700) + 2 tens (20) + 3 ones (3) = 723",
    },
    {
      hundreds: 3,
      tens: 7,
      ones: 4,
      answer: 374,
      explanation: "3 hundreds (300) + 7 tens (70) + 4 ones (4) = 374",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];

  const handleCheck = () => setSubmitted(true);
  const handleNext = () => {
    setInput("");
    setSubmitted(false);
    setCurrent((prev) => (prev + 1) % questions.length);
  };

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 mx-auto"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
      />
    </svg>
  );

  const XIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 mx-auto"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 17.59 6.41 19 12 17.59 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );

return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300 transform hover:shadow-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-gray-900 tracking-tight flex items-center justify-center gap-3">
                <span>🧮</span> Place Value Quiz
            </h2>
           
            <div className="flex flex-col sm:flex-row sm:justify-center gap-6 sm:gap-8 mb-8 sm:mb-10">
                {/* Hundreds */}
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-3 gap-2">
                        {Array(q.hundreds)
                            .fill()
                            .map((_, hundredIndex) => (
                                <div
                                    key={hundredIndex}
                                    className="grid grid-cols-10 gap-1 border-1 border-blue-300 bg-blue-100 shadow-sm"
                                >
                                    {Array(100)
                                        .fill()
                                        .map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-blue-400 w-1 h-1 sm:w-1 sm:h-1"
                                            ></div>
                                        ))}
                                </div>
                            ))}
                    </div>
                    <p className="mt-3 text-sm sm:text-base font-medium text-gray-700">
                        {q.hundreds} hundred(s)
                    </p>
                </div>

                {/* Tens */}
                <div className="flex flex-col items-center">
                    <div className={`grid grid-cols-${q.tens} gap-1 p-1 border-2 border-green-300 bg-green-100 shadow-sm`}>
                        {Array(q.tens * 10)
                            .fill()
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-green-400 w-1 h-1 sm:w-2 sm:h-2"
                                ></div>
                            ))}
                    </div>
                    <p className="mt-3 text-sm sm:text-base font-medium text-gray-700">
                        {q.tens} ten(s)
                    </p>
                </div>

                {/* Ones */}
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-3 gap-2 p-3 border-2 border-red-300 bg-red-100 shadow-sm">
                        {Array(q.ones)
                            .fill()
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-red-400 w-2 h-2 sm:w-2 sm:h-2"
                                ></div>
                            ))}
                    </div>
                    <p className="mt-3 text-sm sm:text-base font-medium text-gray-700">
                        {q.ones} one(s)
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <label className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                        What number does this represent?
                    </label>
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border-2 border-gray-200 p-3 sm:p-4 rounded-xl w-full max-w-xs text-center text-lg sm:text-xl font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 bg-gray-50"
                        placeholder="Enter your answer"
                    />
                </div>

                {!submitted ? (
                    <button
                        onClick={handleCheck}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-sm sm:text-base"
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-sm sm:text-base"
                    >
                        Next Question
                    </button>
                )}

                {submitted && (
                    <div className="mt-6 animate-fadeIn">
                        {parseInt(input) === q.answer ? (
                            <div className="text-green-600 font-semibold flex flex-col items-center gap-3">
                                <CheckIcon />
                                <p className="text-base sm:text-lg">
                                    Correct! {q.explanation}
                                </p>
                            </div>
                        ) : (
                            <div className="text-red-600 font-semibold flex flex-col items-center gap-3">
                                <XIcon />
                                <p className="text-base sm:text-lg">
                                    Incorrect! The correct answer is{" "}
                                    <span className="font-bold">{q.answer}</span>.<br />
                                    Explanation: {q.explanation}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default GridExerciseQuiz;
