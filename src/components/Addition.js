import React, { useState, useEffect, useRef } from "react";

export default function Addition({ lesson = {} }) {
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userInput, setUserInput] = useState(["", ""]); // [tens, ones]
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);

  const tensRef = useRef(null);
  const onesRef = useRef(null);

  const getRandomFromRange = (range) => {
    if (Array.isArray(range) && range.length === 2) {
      const [min, max] = range;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return null;
  };

  const generateProblem = () => {
    const num1 =
      getRandomFromRange(lesson?.numbers?.a) ??
      Math.floor(Math.random() * 99) + 1;
    const num2 =
      getRandomFromRange(lesson?.numbers?.b) ??
      Math.floor(Math.random() * 99) + 1;

    setProblems((prev) => [
      ...prev,
      {
        num1,
        num2,
        expectedSum: num1 + num2,
        expectedTens: Math.floor((num1 + num2) / 10).toString(),
        expectedOnes: ((num1 + num2) % 10).toString(),
      },
    ]);
    setCurrentProblemIndex(0);
    setUserInput(["", ""]);
    setFeedback("");
    setIsKeypadVisible(false);
  };

  useEffect(() => {
    if (problems.length === 0) generateProblem();
  }, []);

  useEffect(() => {
    onesRef.current?.focus();
  }, [currentProblemIndex]);

  const currentProblem = problems[currentProblemIndex];
  if (!currentProblem) return <div>Loading...</div>;

  const digits1 = currentProblem.num1.toString().padStart(2, "0");
  const digits2 = currentProblem.num2.toString().padStart(2, "0");
  const sumOnes = parseInt(digits1[1]) + parseInt(digits2[1]);
  const carry = sumOnes >= 10 ? Math.floor(sumOnes / 10) : 0;

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newInput = [...userInput];
    newInput[index] = value.slice(0, index === 0 ? 2 : 1);
    setUserInput(newInput);

    if (index === 1 && value.length === 1) {
      setTimeout(() => {
        tensRef.current?.focus();
      }, 100);
    }
  };

  const checkAnswer = () => {
    const isCorrect =
      userInput[0] === currentProblem.expectedTens &&
      userInput[1] === currentProblem.expectedOnes;

    setAttempts((prev) => prev + 1);

    if (isCorrect) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);

      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex((i) => i + 1);
        } else {
          alert(
            `You completed all problems! Score: ${score + 1}/${problems.length}`
          );
          generateProblem();
        }
        setUserInput(["", ""]);
        setFeedback("");
      }, 800);
    } else {
      setFeedback(
        `❌ Incorrect! The correct answer is ${currentProblem.expectedTens}${currentProblem.expectedOnes}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (userInput[0] && userInput[1]) {
        checkAnswer();
      }
    }
  };

  const resetInputs = () => {
    setUserInput(["", ""]);
    setFeedback("");
    setTimeout(() => onesRef.current?.focus(), 100);
  };

  const addDigit = (digit) => {
    const focused = document.activeElement.id;
    if (focused === "input-1") {
      handleInputChange({ target: { value: userInput[1] + digit } }, 1);
    } else if (focused === "input-0") {
      handleInputChange({ target: { value: userInput[0] + digit } }, 0);
    }
  };

  const deleteDigit = () => {
    const focused = document.activeElement.id;
    if (focused === "input-1") {
      handleInputChange({ target: { value: userInput[1].slice(0, -1) } }, 1);
    } else if (focused === "input-0") {
      handleInputChange({ target: { value: userInput[0].slice(0, -1) } }, 0);
    }
  };

  return (
    <div className="min-h-screen to-indigo-100 flex p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-auto flex flex-col">
        <p className="text-green-600 font-semibold mb-6">
          Score: {score} | Attempts: {attempts}
        </p>

        <h1 className="text-3xl font-extrabold text-left mb-6 text-gray-800">
          Add:
        </h1>

        <div className="font-mono text-xl text-right space-y-1 w-40 justify-left">
          <div className="flex justify-center space-x-2 h-6">
            <div className="w-8"></div>
            <div className="w-8 text-red-500">{carry > 0 ? carry : ""}</div>
          </div>

          <div className="flex justify-end space-x-2">
            <div className="w-8 text-3xl">{digits1[0]}</div>
            <div className="w-8 text-3xl">{digits1[1]}</div>
          </div>

          <div className="flex justify-end space-x-2">
            <div className="w-8 text-blue-600">+</div>
            <div className="w-8 text-3xl">{digits2[0]}</div>
            <div className="w-8 text-3xl">{digits2[1]}</div>
          </div>

          <div className="flex justify-end">
            <div className="w-20 border-b border-black"></div>
          </div>

          <div className="flex justify-end space-x-2 mt-1">
            <input
              ref={tensRef}
              id="input-0"
              type="number"
              maxLength={2}
              value={userInput[0]}
              onChange={(e) => handleInputChange(e, 0)}
              onKeyDown={handleKeyDown}
              disabled={!userInput[1]}
              className={`w-8 text-center border-b border-gray-500 outline-none focus:border-green-500 ${
                userInput[0] && userInput[0] !== currentProblem.expectedTens
                  ? "border-red-500"
                  : ""
              }`}
            />
            <input
              ref={onesRef}
              id="input-1"
              type="number"
              maxLength={1}
              value={userInput[1]}
              onChange={(e) => handleInputChange(e, 1)}
              onKeyDown={handleKeyDown}
              className={`w-8 text-center border-b border-gray-500 outline-none focus:border-green-500 ${
                userInput[1] && userInput[1] !== currentProblem.expectedOnes
                  ? "border-red-500"
                  : ""
              }`}
            />
          </div>
        </div>
        {userInput[0] && userInput[1] && (
          <button
            onClick={checkAnswer}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Check Answer
          </button>
        )}
        {feedback && (
          <div
            className={`mt-4 text-center py-3 rounded-lg font-semibold text-lg ${
              feedback.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback}
          </div>
        )}

        {isKeypadVisible && (
          <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-xs self-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => addDigit(num.toString())}
                className="bg-indigo-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-600 transition transform hover:scale-105"
              >
                {num}
              </button>
            ))}
            <button
              onClick={deleteDigit}
              className="bg-yellow-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition transform hover:scale-105"
            >
              ⌫
            </button>
            <button
              onClick={() => addDigit("0")}
              className="bg-indigo-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-600 transition transform hover:scale-105"
            >
              0
            </button>
            <button
              onClick={resetInputs}
              className="bg-gray-500 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:scale-105"
            >
              Reset
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          {/* <button
            onClick={() => setIsKeypadVisible(!isKeypadVisible)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {isKeypadVisible ? "Hide Keypad" : "Show Keypad"}
          </button>
          <button
            onClick={resetInputs}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Next Question
          </button> */}
        </div>
      </div>
    </div>
  );
}
