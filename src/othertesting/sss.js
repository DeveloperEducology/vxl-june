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
  const [showSolution, setShowSolution] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    setFeedback("");
    setSubmitted(false);
    setShowSolution(false);
    if (lesson?.options) {
      setShuffledOptions(shuffleArray(lesson.options));
    }
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
    const correctOption = lesson.options.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption ? correctOption.text : null;

    setFeedback(
      isCorrect
        ? lesson.feedback?.correct || "Correct!"
        : `${lesson.feedback?.incorrect || "Incorrect."}${
            correctAnswer ? ` (Correct: ${correctAnswer})` : ""
          }`
    );
    setSubmitted(true);
    setShowSolution(true); // Show solution after submission, regardless of correctness
    setShowYoutube(false);
    onSubmit(isCorrect, userAnswer, correctAnswer);
  };

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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 p-2 rounded flex flex-wrap items-center"
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
        {shuffledOptions.map((option, idx) => {
          const isSelected = userAnswer === option.text;
          const isCorrect = option.isCorrect;

          return (
            <button
              key={idx}
              onClick={() => !submitted && handleSelectMCQ(option.text)}
              className={`px-4 py-2 rounded-md min-w-[140px] text-sm border text-center transition-all duration-200 ${
                isSelected
                  ? "bg-blue-400 text-white"
                  : "bg-white border-blue-300 text-gray-800 hover:bg-indigo-100"
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
      {feedback && (
        <p
          className={`text-base font-medium mt-2 ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Show Solution */}
      {submitted && lesson.solutionKey && showSolution && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="font-semibold text-yellow-800 mb-2">Solution:</div>
          <p className="text-sm text-gray-700">
            {lesson.solutionKey.formula || "No formula provided."}
          </p>
          {lesson.solutionKey.steps?.length > 0 ? (
            <ol className="list-decimal pl-5 mt-2">
              {lesson.solutionKey.steps.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 mb-1">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-700">No steps provided.</p>
          )}
        </div>
      )}

      {/* Optional: Toggle Solution Button */}
      {submitted && lesson.solutionKey && (
        <button
          type="button"
          onClick={() => setShowSolution((prev) => !prev)}
          className="text-blue-600 underline mt-2"
        >
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
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
