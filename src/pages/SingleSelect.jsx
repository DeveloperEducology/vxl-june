import React, { useState, memo } from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

// Option component for rendering individual quiz options
const Option = memo(({ option, index, isSelected, submitted, onSelect }) => {
  const alphabet = String.fromCharCode(65 + index);
  const showCorrect = submitted && isSelected && option.isCorrect;
  const showIncorrect = submitted && isSelected && !option.isCorrect;

  const baseClasses = `
    relative border-2 rounded-lg p-4 w-[150px] sm:w-[180px] transition-all duration-300 cursor-pointer
    bg-gray-50 hover:bg-gray-100 transform hover:scale-105
    ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
    ${showCorrect ? "border-green-500 ring-2 ring-green-200" : ""}
    ${showIncorrect ? "border-red-500 ring-2 ring-red-200" : ""}
  `;

  return (
    <div
      onClick={() => !submitted && onSelect(option)}
      className={baseClasses}
      role="radio"
      aria-checked={isSelected}
      aria-label={`Option ${alphabet}: ${option.text || "Image option"}`}
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && !submitted && onSelect(option)
      }
    >
      {/* Option Letter Badge */}
      <div
        className={`
          absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
          ${showCorrect ? "bg-green-500 text-white" : ""}
          ${showIncorrect ? "bg-red-500 text-white" : ""}
          ${isSelected && !submitted ? "bg-blue-500 text-white" : ""}
          ${!isSelected && !submitted ? "bg-gray-200 text-gray-700" : ""}
        `}
      >
        {alphabet}
      </div>

      {/* Option Content */}
      {option.image ? (
        <img
          src={option.image}
          alt={`Option ${alphabet}`}
          className="w-full h-auto max-h-24 object-contain rounded-md mb-2"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/150?text=Image+Not+Found")
          }
        />
      ) : (
        <div className="font-medium text-gray-700 text-center py-1 truncate max-w-full">
          {option.text || "No text provided"}
        </div>
      )}

      {/* Feedback Indicator for Selected Option Only */}
      {submitted && isSelected && (
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-2 text-center text-sm font-semibold text-white
            ${option.isCorrect ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {option.isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </div>
      )}
    </div>
  );
});

// Feedback component for rendering submission feedback
const Feedback = memo(({ isCorrect, feedback }) => (
  <div
    className={`
      mt-6 p-4 rounded-lg text-base animate-fade-in
      ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
    `}
    role="alert"
  >
    {isCorrect ? (
      <div>
        <p className="font-semibold">✅ Well done! Correct answer!</p>
        {feedback?.correct && <p className="mt-2">{feedback.correct}</p>}
      </div>
    ) : (
      <div>
        <p className="font-semibold">❌ Incorrect answer</p>
        <p className="mt-2">
          {feedback?.incorrect || "Please try again with another question."}
        </p>
      </div>
    )}
  </div>
));

// Main SingleSelect component
const SingleSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Safely handle data and options
  const safeData = data || {};
  const options = Array.isArray(safeData.options) ? safeData.options : [];

  // Handle submit action
  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  // Handle next question action
  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext(selected?.isCorrect || false);
  };

  const renderImages = (count, imageUrl) => {
    return Array.from({ length: count }, (_, i) => (
      <img
        key={i}
        src={imageUrl}
        alt={`${"ddd"} icon ${i + 1}`}
        loading="lazy"
        style={{ width: "400px", height: "400px" }}
        className="w-15 h-15 object-contain mx-1"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/64?text=Image+Not+Found")
        }
      />
    ));
  };

  // Validate data
  if (!safeData.prompt && options.length === 0) {
    return (
      <div className="text-red-500 py-4 text-center" role="alert">
        Invalid quiz data: No question or options provided
      </div>
    );
  }

  return (
    <div className="single-select-quiz mx-auto max-w-3xl p-6 bg-white rounded-xl shadow-lg">
      {/* Question Prompt */}
      {safeData.prompt ? (
        <div
          className="mb-6 text-xl font-semibold text-gray-800"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(safeData.prompt),
          }}
          role="region"
          aria-label="Question prompt"
        />
      ) : (
        <div className="text-red-500 mb-6 text-center" role="alert">
          No question provided
        </div>
      )}
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-1">
          {renderImages(
            1,
            "https://icon2.cleanpng.com/20231030/czg/transparent-cartoon-fish-happy-fish-orange-fish-white-fins-blu-happy-cartoon-fish-with-orange-body-and-blue-1711037303572.webp"
          )}
        </div>
      </div> */}

      {/* Options Grid */}
      {options.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          role="radiogroup"
        >
          {options.map((option, index) => (
            <Option
              key={index}
              option={option}
              index={index}
              isSelected={selected === option}
              submitted={submitted}
              onSelect={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="text-red-500 py-2 text-center" role="alert">
          No options available
        </div>
      )}
      <div className="mt-8 flex justify-left gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`
              px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300
              ${
                selected !== null
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
            disabled={selected === null}
            aria-label="Submit answer"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
            aria-label="Next question"
          >
            Next Question
          </button>
        )}
      </div>

      {/* Enhanced Feedback */}
      {submitted && (
        <Feedback
          isCorrect={selected?.isCorrect}
          feedback={safeData.feedback}
        />
      )}
    </div>
  );
};

// PropTypes for type checking
SingleSelect.propTypes = {
  data: PropTypes.shape({
    prompt: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        isCorrect: PropTypes.bool.isRequired,
      })
    ),
    feedback: PropTypes.shape({
      correct: PropTypes.string,
      incorrect: PropTypes.string,
    }),
  }),
  onNext: PropTypes.func.isRequired,
};

// Add custom animation for feedback
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);

export default SingleSelect;
