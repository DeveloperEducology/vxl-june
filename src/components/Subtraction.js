import React, { useState, useEffect } from "react";

export default function Subtraction({ lesson = {} }) {
  const [question, setQuestion] = useState(null);
  const [number1, setNumber1] = useState(null);
  const [number2, setNumber2] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);

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

    let num1 = getRandomFromRange(aRange) ?? Math.floor(Math.random() * 20) + 1;
    let num2 = getRandomFromRange(bRange) ?? Math.floor(Math.random() * 20) + 1;

    // Ensure result is not negative
    if (num2 > num1) [num1, num2] = [num2, num1];

    const correctAnswer = num1 - num2;

    let options = new Set();
    while (options.size < 3) {
      const offset = Math.floor(Math.random() * 11) - 5; // ±5
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer >= 0 && wrongAnswer !== correctAnswer) {
        options.add(wrongAnswer);
      }
    }

    options = [...options];
    options.push(correctAnswer);
    options.sort(() => 0.5 - Math.random());

    setQuestion({
      stem: `What is ${num1} minus ${num2}?`,
      number: `${num1} - ${num2} = `,
      correctAnswer,
      options,
    });

    setNumber1(num1);
    setNumber2(num2);
    setSelectedAnswer(null);
    setFeedback("");
    setUserAnswer("");
    setIsKeypadVisible(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);
    if (option === question.correctAnswer) {
      setFeedback("✅ Correct!");
      setTimeout(() => generateQuestion(), 1000);
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `❌ Incorrect! The correct answer is ${question.correctAnswer}`
      );
    }
    setAttempts((prev) => prev + 1);
  };

  const checkAnswer = () => {
    if (userAnswer.trim() === "") {
      setFeedback("❌ Please enter an answer.");
      return;
    }
    const answer = Number(userAnswer);
    setSelectedAnswer(answer);
    if (answer === question.correctAnswer) {
      setFeedback("✅ Correct!");
      setTimeout(() => generateQuestion(), 1000);
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `❌ Incorrect! The correct answer is ${question.correctAnswer}`
      );
    }
    setAttempts((prev) => prev + 1);
    setUserAnswer("");
    setIsKeypadVisible(false);
  };

  const handleInputClick = () => setIsKeypadVisible(true);

  return (
    <div className="min-h-screen bg-gradient-to-br flex p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg flex flex-col items-left">
          <p className="text-green-600 font-semibold mb-7">
          Score: {score} | Attempts: {attempts}
        </p>
        {question && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg font-extrabold text-left mb-6 text-gray-800">
                Subtract:
              </p>
              <span
                className="text-3xl text-gray-600 mb-4 cursor-pointer"
                onClick={() => setIsKeypadVisible(!isKeypadVisible)}
              >
                ⌨️
              </span>
            </div>
            <div className="flex flex-col mb-4">
              <p className="text-2xl ml-6 font-semibold text-gray-700 tracking-widest">
                {number1}
              </p>
              <p className="text-2xl font-semibold text-gray-700 tracking-widest">
                − {number2}
              </p>
              <hr className="my-2 w-24 border-t-2 border-gray-300" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                // onClick={handleInputClick}
                className="w-24 text-center text-xl border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Answer"
                ref={(input) => {
                  if (input) {
                    input.setSelectionRange(0, 0);
                  }
                }}
              />
            </div>

            {isKeypadVisible && (
              <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setUserAnswer((prev) => prev + num.toString())
                    }
                    className="bg-indigo-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-600 transition transform hover:scale-105"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setUserAnswer((prev) => prev.slice(0, -1))}
                  className="bg-yellow-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition transform hover:scale-105"
                >
                  ⌫
                </button>
                <button
                  onClick={() => setUserAnswer((prev) => prev + "0")}
                  className="bg-indigo-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-600 transition transform hover:scale-105"
                >
                  0
                </button>
                <button
                  onClick={checkAnswer}
                  className="bg-green-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-green-600 transition transform hover:scale-105"
                >
                  ✅
                </button>
              </div>
            )}

            {!lesson?.isOptions && (
              <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`py-3 px-4 rounded-lg text-lg font-semibold transition-all w-full shadow-md ${
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
            )}

            {feedback && (
              <div
                className={`text-center py-3 mt-4 rounded-lg font-semibold text-lg ${
                  feedback.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="flex justify-between items-center mt-8 w-full">
              <button
                onClick={checkAnswer}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Check Answer
              </button>
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
