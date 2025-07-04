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
  const [showYoutube, setShowYoutube] = useState(false);

  useEffect(() => {
    setFeedback("");
    setSubmitted(false);
  }, [lesson]);

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
    readAloud(value);
    setUserAnswer(value);
  };

  const handleSubmit = () => {
    const selected = lesson.options.find((opt) => opt.text === userAnswer);
    const isCorrect = selected?.isCorrect;
    // Find the correct answer(s)
    const correctOption = lesson.options.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption ? correctOption.text : null;

    setFeedback(
      isCorrect
        ? lesson.feedback?.correct
        : `${lesson.feedback?.incorrect}${
            correctAnswer ? ` (Correct: ${correctAnswer})` : ""
          }`
    );
    setSubmitted(true);
    onSubmit(isCorrect, userAnswer, correctAnswer);
  };

  // console.log("userAnswer", userAnswer);

  return (
    <div className="space-y-5">
      {/* Show Hint */}
      {lesson.youtube && (
        <div>
          <button
            type="button"
            onClick={() => setShowYoutube((prev) => !prev)}
            className="text-blue-600 underline mb-2"
          >
            {showYoutube ? "Hide Video" : "Show Video"}
          </button>
          {showYoutube && (
            <div className="mt-2">
              <iframe
                width="400"
                height="225"
                src={`https://www.youtube.com/embed/${lesson.youtube}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      {/* Lesson text */}
      {lesson.text.map((line, idx) => (
        <p
          key={idx}
          className="text-lg font-medium text-gray-800 flex items-center"
        >
          {idx === 0 && (
            <button
              type="button"
              onClick={() => readAloud(line)}
              className="mr-2 text-xl"
              aria-label="Read aloud"
            >
              🔉
            </button>
          )}
          {line}
        </p>
      ))}

      {/* Prompt with inputs */}
      {lesson.prompt?.map((line, idx) => {
        let inputIndex = 0;
        const parts = line.split(/(null)/g);
        return (
          <p
            key={`prompt-${idx}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 border border-green-400 p-2 rounded flex flex-wrap items-center"
          >
            {parts.map((part, i) => {
              if (part === "null") {
                const currentIndex = inputIndex++;
                return (
                  <input
                    key={`input-${idx}-${i}`}
                    type="text"
                    className="mx-1 sm:mx-2 w-12 sm:w-16 text-center border-b-2 text-base sm:text-lg bg-transparent focus:outline-none border-gray-400"
                    value={userAnswer?.[currentIndex] || ""}
                    onChange={(e) =>
                      handleInputChange(currentIndex, e.target.value)
                    }
                    disabled={submitted}
                    placeholder="?"
                  />
                );
              }
              return <span key={`part-${idx}-${i}`}>{part}</span>;
            })}
          </p>
        );
      })}
      {/* Lesson image */}
      {lesson.image && (
        <div className="flex justify-left">
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
          className="text-xl"
          aria-label="Read all options"
        >
          🔉
        </button>
        <span className="text-sm text-gray-500">Read all options</span>
      </div>

      {/* Options as buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        {lesson.options.map((option, idx) => {
          const isSelected = userAnswer === option.text;
          const isCorrect = option.isCorrect;

          return (
            <button
              key={idx}
              onClick={() => !submitted && handleSelectMCQ(option.text)}
              className={`px-4 py-2 rounded-md min-w-[140px] text-sm border text-center transition-all duration-200 ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-800 hover:bg-indigo-100"
              } ${submitted ? "cursor-not-allowed opacity-90" : ""}`}
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
                  className={`block mt-1 text-sm ${
                    isCorrect ? "text-green-600" : "text-red-600"
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
      {feedback && !lesson.options.some((opt) => opt.text === userAnswer) && (
        <p
          className={`text-base font-medium mt-2 ${
            feedback === lesson.feedback?.correct
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 mt-4">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              !userAnswer
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Submit
          </button>
        )}
        {submitted && (
          <button
            onClick={onNext}
            className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
