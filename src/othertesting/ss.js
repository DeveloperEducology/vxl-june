import { useState, useEffect } from "react";

export default function PictureMCQ({
  lesson,
  userAnswer,
  setUserAnswer,
  onSubmit,
  onNext,
}) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFeedback("");
    setSubmitted(false);
    setUserAnswer(null); // Reset userAnswer on lesson change
  }, [lesson, setUserAnswer]);

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleInputChange = (index, value) => {
    const updated = Array.isArray(userAnswer) ? [...userAnswer] : [];
    updated[index] = value;
    setUserAnswer(updated);
  };

  const handleSelectMCQ = (value) => {
    if (!submitted) {
      setUserAnswer(value); // Set the selected option
      setFeedback(""); // Clear previous feedback
    }
  };

  const handleSubmit = () => {
    if (!userAnswer) {
      setFeedback("Please select an option before submitting.");
      return;
    }

    const selected = lesson.options.find((opt) => opt.text === userAnswer);
    if (!selected) {
      setFeedback("Invalid selection. Please try again.");
      return;
    }

    const isCorrect = selected.correct;
    setFeedback(
      isCorrect ? "Correct! Well done!" : "Incorrect. Please try again!"
    );
    setSubmitted(true);
    onSubmit(isCorrect, userAnswer);
  };

  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {/* Lesson text */}
      <div className="space-y-2">
        {lesson.text.map((line, idx) => (
          <p
            key={idx}
            className="text-base sm:text-lg font-medium text-gray-800 flex items-center"
          >
            {idx === 0 && (
              <button
                type="button"
                onClick={() => readAloud(line)}
                className="mr-2 text-lg sm:text-xl"
                aria-label="Read question aloud"
              >
                🔉
              </button>
            )}
            {line}
          </p>
        ))}
      </div>

      {/* Lesson image */}
      {lesson.image && (
        <div className="flex justify-center">
          <img
            src={lesson.image}
            alt="Lesson visual"
            className="w-full max-w-xs sm:max-w-sm rounded-lg shadow-md"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        </div>
      )}

      {/* Read Options */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            readAloud(lesson.options.map((opt) => opt.text).join(". "))
          }
          className="text-lg sm:text-xl"
          aria-label="Read all options"
        >
          🔉
        </button>
        <span className="text-xs sm:text-sm text-gray-500">
          Read all options
        </span>
      </div>

      {/* Options as buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {lesson.options.map((option, idx) => {
          const isSelected = userAnswer === option.text;
          const isCorrect = option.correct;

          return (
            <button
              key={idx}
              onClick={() => handleSelectMCQ(option.text)}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 w-full ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-gray-300 text-gray-800 hover:bg-indigo-100"
              } ${
                submitted ? "cursor-not-allowed opacity-90" : "cursor-pointer"
              }`}
              disabled={submitted}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.text}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mb-2"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/100")
                  }
                />
              )}
              <span className="text-sm sm:text-base font-medium">
                {option.text}
              </span>
              {submitted && isSelected && (
                <span
                  className={`text-xs sm:text-sm mt-1 ${
                    isCorrect ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {feedback}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Final Feedback */}
      {feedback && (
        <p
          className={`text-sm sm:text-base font-medium mt-2 text-center ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-3 sm:gap-4 mt-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-sm sm:text-base text-white font-semibold transition ${
              !userAnswer
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={!userAnswer}
          >
            Submit
          </button>
        )}
        {submitted && (
          <button
            onClick={onNext}
            className="px-4 py-2 rounded text-sm sm:text-base bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
