import { useState } from "react";

export default function TesingQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [isReading, setIsReading] = useState(false);

  const lessons = [
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: ["The first picture is a dog. Which picture is third?"],
      prompt: ["🐕 🐕 🏠 🐾 🐕 🏠"],
      isStyleApplied: true,
      type: "mcq",
      options: [
        { text: "House", isCorrect: true },
        { text: "dog", isCorrect: false },
        { text: "paw", isCorrect: false },
      ],
      feedback: {
        correct: "Correct!",
        incorrect: "Try again. Consider how many digits each number has.",
      },
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: ["Which words make this statement true?"],
      prompt: ["1000 🚗 ____ 999 🚗"],
      isStyleApplied: false,
      type: "mcq",
      options: [
        { text: "is greater than", isCorrect: true },
        { text: "is less than", isCorrect: false },
        { text: "is equal to", isCorrect: false },
      ],
      feedback: {
        correct: "Correct!",
        incorrect: "Try again. Consider how many digits each number has.",
      },
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: ["Which words make this statement true?", "0 ____ 1."],
      isStyleApplied: true,
      type: "mcq",
      options: [
        { text: "is greater than", isCorrect: false },
        { text: "is less than", isCorrect: true },
        { text: "is equal to", isCorrect: false },
      ],
      feedback: {
        correct: "Correct!",
        incorrect: "Try again. Consider how many digits each number has.",
      },
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: ["Compare the expressions", " 8 🚗🚗🚗🚗🚗🚗🚗🚗", " 0 🚗", "null"],

      isStyleApplied: true,
      type: "picture-addition",
      correctAnswer: ["8"],
    },
    {
      lessonId: "683e7c9e45ceb994d4e7724c",
      text: [
        "Add the following rabbits",
        "1. 🐇🐇🐇🐇 = null",
        "2. 🐇🐇🐇🐇 + 🐇🐇🐇🐇 = null",
        "3. 🐇🐇🐇🐇 + 🐇🐇🐇🐇 + 🐇🐇🐇🐇 = null",
      ],
      isStyleApplied: true,
      type: "picture-addition",
      correctAnswer: ["4", "8", "12"],
    },
  ];

  const currentLesson = lessons[currentQuestionIndex];
  const isMCQ = currentLesson.options && currentLesson.options.length > 0;

  const handleSelectMCQ = (value) => setUserAnswers([value]);

  const handleInputChange = (index, value) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    if (isMCQ) {
      const selected = userAnswers[0];
      const correct = currentLesson.options.find((opt) => opt.isCorrect)?.text;
      const result =
        selected === correct
          ? ["✅ Correct"]
          : [`❌ Correct answer: ${correct}`];
      setFeedback(result);
    } else {
      const result = currentLesson.correctAnswer.map((ans, idx) =>
        userAnswers[idx]?.trim() === ans
          ? "✅ Correct"
          : `❌ Correct answer: ${ans}`
      );
      setFeedback(result);
    }
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
        <div className="mb-6 space-y-4">
          {/* MCQ */}
          {isMCQ && (
            <>
              {currentLesson.text.map((line, idx) => (
                <p
                  key={`text-${idx}`}
                  className={
                    currentLesson.isStyleApplied
                      ? "text-xl font-semibold text-gray-800"
                      : ""
                  }
                >
                  {idx === 0 && (
                    <button
                      type="button"
                      onClick={() => readAloud(line)}
                      className="mr-2 text-xl align-middle"
                      aria-label="Read aloud"
                      tabIndex={0}
                    >
                      🔉
                    </button>
                  )}
                  {line}
                </p>
              ))}

              {/* Render prompt if exists */}
              {currentLesson.prompt &&
                currentLesson.prompt.map((line, idx) => {
                  let inputIndex = 0;
                  const parts = line.split(/(null)/g);

                  return (
                    <p
                      key={`prompt-${idx}`}
                      className={
                        currentLesson.isStyleApplied
                          ? "text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 border-2 p-2 border-green-600 mb-4 break-words"
                          : "text-lg sm:text-xl md:text-2xl break-words"
                      }
                      style={{ wordBreak: "break-word" }}
                    >
                      {parts.map((part, i) => {
                        if (part === "null") {
                          const thisIndex = inputIndex++;
                          return (
                            <span
                              key={`prompt-input-${idx}-${i}`}
                              className="inline-block align-middle"
                            >
                              <input
                                type="text"
                                value={userAnswers[thisIndex] || ""}
                                onChange={(e) =>
                                  handleInputChange(thisIndex, e.target.value)
                                }
                                disabled={submitted}
                                className={`inline-block w-12 sm:w-16 mx-1 px-2 py-1 border-b-2 text-center text-base sm:text-lg border-gray-400 bg-transparent focus:outline-none ${
                                  submitted
                                    ? "bg-gray-100 text-gray-500"
                                    : "focus:border-indigo-800"
                                }`}
                                placeholder="?"
                                style={{ minWidth: "2.5rem" }}
                              />
                              {submitted && feedback[thisIndex] && (
                                <span
                                  className={`ml-1 text-xs sm:text-sm ${
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
                          return (
                            <span
                              key={`prompt-text-${idx}-${i}`}
                              onClick={() => readAloud(part)}
                              className="break-words"
                              style={{ wordBreak: "break-word" }}
                            >
                              {part}
                            </span>
                          );
                        }
                      })}
                    </p>
                  );
                })}

              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    readAloud(
                      currentLesson.options
                        .map((option) => option.text)
                        .join(". ")
                    )
                  }
                  className="text-xl align-middle"
                  aria-label="Read all options aloud"
                  tabIndex={0}
                >
                  🔉
                </button>
                <span className="text-sm text-gray-500">Read all options</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                {currentLesson.options.map((option, idx) => {
                  const isSelected = userAnswers[0] === option.text;
                  const isCorrect = option.isCorrect;
                  const showFeedback = submitted;

                  return (
                    <button
                      key={idx}
                      onClick={() => !submitted && handleSelectMCQ(option.text)}
                      className={`px-4 py-2 rounded-md border transition-all duration-200 text-sm min-w-[140px] text-center ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-100"
                      } ${submitted ? "cursor-not-allowed opacity-90" : ""}`}
                      disabled={submitted}
                    >
                      {option.text}
                      {showFeedback && isSelected && (
                        <span
                          className={`block mt-1 text-sm ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {feedback[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Non-MCQ (fill-in-the-blank style) */}
          {!isMCQ &&
            (() => {
              let inputIndex = 0;
              return (
                <>
                  <p
                    className={
                      currentLesson.isStyleApplied
                        ? "text-xl font-semibold text-gray-800"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      onClick={() => readAloud(currentLesson.text[0])}
                      className="mr-2 text-xl align-middle"
                      aria-label="Read aloud"
                      tabIndex={0}
                    >
                      🔉
                    </button>
                    {currentLesson.text[0]}
                  </p>
                  {currentLesson.text.slice(1).map((line, idx) => {
                    const parts = line.split(/(null)/g);
                    return (
                      <p
                        key={idx}
                        className={
                          currentLesson.isStyleApplied
                            ? "text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 break-words"
                            : "break-words"
                        }
                        style={{ wordBreak: "break-word" }}
                      >
                        {parts.map((part, i) => {
                          if (part === "null") {
                            const thisIndex = inputIndex++;
                            return (
                              <span
                                key={`${idx}-${i}`}
                                className="inline-block align-middle"
                              >
                                <input
                                  type="text"
                                  value={userAnswers[thisIndex] || ""}
                                  onChange={(e) =>
                                    handleInputChange(thisIndex, e.target.value)
                                  }
                                  disabled={submitted}
                                  className={`inline-block w-12 sm:w-16 mx-1 px-2 py-1 border-b-2 text-center text-base sm:text-lg border-gray-400 bg-transparent focus:outline-none ${
                                    submitted
                                      ? "bg-gray-100 text-gray-500"
                                      : "focus:border-indigo-800"
                                  }`}
                                  placeholder="?"
                                  style={{ minWidth: "2.5rem" }}
                                />
                                {submitted && feedback[thisIndex] && (
                                  <span
                                    className={`ml-1 text-xs sm:text-sm ${
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
                            // Count the number of rabbit emojis in the part
                            const rabbitCount = (part.match(/🐇/g) || [])
                              .length;
                            const label =
                              rabbitCount > 0
                                ? `${rabbitCount} rabbit${
                                    rabbitCount > 1 ? "s" : ""
                                  } "multiplies by" `
                                : "";
                            return (
                              <span
                                key={`${idx}-${i}`}
                                onClick={() =>
                                  readAloud(
                                    label
                                      ? `${label}: ${part.replace(/🐇/g, "")}`
                                      : part
                                  )
                                }
                                className="break-words"
                                style={{ wordBreak: "break-word" }}
                              >
                                {part}
                              </span>
                            );
                          }
                        })}
                      </p>
                    );
                  })}
                </>
              );
            })()}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            disabled={
              submitted ||
              (isMCQ
                ? !userAnswers[0]
                : userAnswers.length < currentLesson.correctAnswer?.length ||
                  userAnswers.some((a) => !a?.trim()))
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              submitted ||
              (isMCQ
                ? !userAnswers[0]
                : userAnswers.length < currentLesson.correctAnswer?.length ||
                  userAnswers.some((a) => !a?.trim()))
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
