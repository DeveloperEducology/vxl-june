import { useState, useEffect } from "react";
import { FiVolume2 } from "react-icons/fi";

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
  const [selectedMCQIndex, setSelectedMCQIndex] = useState(null); // ✅ Track selected option

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
    setSelectedMCQIndex(null);
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

  const handleSelectMCQ = (index) => {
    setSelectedMCQIndex(index);
  };

  const handleSubmit = () => {
    const selected = shuffledOptions[selectedMCQIndex];
    const isCorrect = selected?.isCorrect ?? false;
    const correctOption = shuffledOptions.find((opt) => opt.isCorrect);

    setFeedback(
      isCorrect
        ? lesson.feedback?.correct || "Correct!"
        : `${lesson.feedback?.incorrect || "Incorrect."} ${
            correctOption ? "(Correct answer highlighted)" : ""
          }`
    );

    setSubmitted(true);
    setShowSolution(true);
    setShowYoutube(false);

    // Send selected image + correct image to onSubmit
    onSubmit(isCorrect, selected?.image, correctOption?.image);
    setUserAnswer(selected?.image);
  };

  const getImageSrc = (htmlString) => {
    const match = htmlString?.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-5">
      {/* <div className="flex flex-wrap justify-left mb-4">
        <img
          src="https://cdn.jsdelivr.net/gh/DeveloperEducology/assets@main/apple.svg"
          width="100"
        ></img>
        <img
          src="https://cdn.jsdelivr.net/gh/DeveloperEducology/assets@main/apple.svg"
          width="100"
        ></img>
        <img
          src="https://cdn.jsdelivr.net/gh/DeveloperEducology/assets@main/apple.svg"
          width="100"
        ></img>
        <img
          src="https://cdn.jsdelivr.net/gh/DeveloperEducology/assets@main/apple.svg"
          width="100"
        ></img>
      </div> */}
      {/* Show YouTube Hint */}
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
      {lesson.text?.map((line, idx) => (
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
              <FiVolume2 size={24} />
            </button>
          )}
          {line}
        </p>
      ))}

{
  lesson.prompt && (
    <p className="text-4xl font-medium text-gray-800">
      <span className="font-semibold"></span> {lesson.prompt}
    </p>
  )
}

      {/* Lesson image (if any) */}
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

      {/* Options as image buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        {shuffledOptions.map((option, idx) => {
          const isSelected = selectedMCQIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => !submitted && handleSelectMCQ(idx)}
              className={`px-4 py-2 rounded-md min-w-[140px] text-sm border text-center transition-all duration-200 ${
                isSelected
                  ? "bg-blue-400 text-white"
                  : "bg-white border-blue-300 text-gray-800 hover:bg-indigo-100"
              } ${submitted ? "cursor-not-allowed opacity-90" : ""}`}
              disabled={submitted}
            >
              {option.image ? (
                <img src={option.image} className="w-25 h-25 sm:h-20 w-20" />
              ) : (
                <div
                  // className="w-24 h-24 mb-2"
                  dangerouslySetInnerHTML={{ __html: option.image }}
                ></div>
              )}
              {option.text && (
                <div
                  // className="w-24 h-24 mb-2"
                  dangerouslySetInnerHTML={{ __html: option.text }}
                ></div>
              )}

              {/* Feedback after submission */}
              {submitted && isSelected && (
                <span
                  className={`block mt-1 text-sm ${
                    option.isCorrect ? "text-green-600" : "text-red-600"
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

      {/* Show Solution if provided */}
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

      {/* Optional Toggle Solution Button */}
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
            disabled={selectedMCQIndex === null}
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              selectedMCQIndex === null
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
