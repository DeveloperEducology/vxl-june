import React, { useState } from "react";
import { motion } from "framer-motion";

// Emoji options
const items = [
  { id: "apple", icon: "🍎" },
  { id: "dog", icon: "🐶" },
  { id: "ball", icon: "⚽" },
  { id: "butterfly", icon: "🦋" },
  { id: "car", icon: "🚗" },
  { id: "cat", icon: "🐱" },
  { id: "cake", icon: "🎂" },
  { id: "heart", icon: "❤️" },
];

// Multiple emoji sequence questions
const questions = [
  [
    { id: "apple", icon: "🍎" },
    { id: "dog", icon: "🐶" },
    { id: "ball", icon: "⚽" },
    { id: "butterfly", icon: "🦋" },
  ],
  [
    { id: "car", icon: "🚗" },
    { id: "cat", icon: "🐱" },
    { id: "cake", icon: "🎂" },
    { id: "heart", icon: "❤️" },
  ],
  [
    { id: "heart", icon: "❤️" },
    { id: "dog", icon: "🐶" },
    { id: "ball", icon: "⚽" },
    { id: "cake", icon: "🎂" },
  ],
];

export default function EmojiGuessQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userGuesses, setUserGuesses] = useState(
    Array(questions[0].length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleGuess = (index, item) => {
    const newGuesses = [...userGuesses];
    newGuesses[index] = item;
    setUserGuesses(newGuesses);
  };

  const handleReset = () => {
    setUserGuesses(Array(currentQuestion.length).fill(null));
    setIsSubmitted(false);
  };

  const handleChangeQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setUserGuesses(Array(questions[index].length).fill(null));
    setIsSubmitted(false);
  };

  const isCorrect = (guess, index) =>
    guess && guess.id === currentQuestion[index].id;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Emoji Guess Quiz</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </header>

      {/* Question Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded font-medium ${
              idx === currentQuestionIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => handleChangeQuestion(idx)}
          >
            Quiz {idx + 1}
          </button>
        ))}
      </div>

      {/* Quiz Section */}
      <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Guess the Emoji Pattern</h2>

        {/* Emoji Slots */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {userGuesses.map((guess, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg text-3xl flex justify-center items-center border-2 ${
                isSubmitted
                  ? isCorrect(guess, index)
                    ? "border-green-500"
                    : "border-red-500"
                  : "border-gray-300"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {guess ? guess.icon : "❓"}
            </motion.div>
          ))}
        </div>

        {/* Emoji Choices */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {userGuesses.map((_, index) => (
            <div key={index} className="flex gap-1 justify-center flex-wrap">
              {items.map((item) => (
                <motion.button
                  key={item.id + index}
                  className={`text-2xl p-2 rounded hover:scale-110 transition ${
                    userGuesses[index]?.id === item.id
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleGuess(index, item)}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {/* Submit */}
        {!isSubmitted && (
          <div className="text-center">
            <button
              onClick={() => setIsSubmitted(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              disabled={userGuesses.includes(null)}
            >
              Submit Answers
            </button>
          </div>
        )}

        {/* Feedback */}
        {isSubmitted && (
          <div className="mt-6 text-center">
            {userGuesses.every((g, i) => isCorrect(g, i)) ? (
              <p className="text-green-600 text-lg font-semibold">
                🎉 All correct! Awesome work!
              </p>
            ) : (
              <p className="text-red-600 text-lg font-semibold">
                ❌ Oops! Some emojis were incorrect. Try again.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-600">
        <p>Made with ❤️ using React, TailwindCSS & Framer Motion</p>
      </footer>
    </div>
  );
}
