import React, { useState, memo } from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";
import "./SingleSelect.css";

// Option component for rendering individual quiz options
const Option = memo(({ option, index, isSelected, submitted, onSelect }) => {
  const alphabet = String.fromCharCode(65 + index);
  const showCorrect = submitted && isSelected && option.isCorrect;
  const showIncorrect = submitted && isSelected && !option.isCorrect;

  return (
    <div
      onClick={() => !submitted && onSelect(option)}
      className={`option-card ${isSelected ? "selected" : ""} ${
        showCorrect ? "correct" : ""
      } ${showIncorrect ? "incorrect" : ""}`}
      role="radio"
      aria-checked={isSelected}
      aria-label={`Option ${alphabet}: ${option.text || "Image option"}`}
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && !submitted && onSelect(option)
      }
    >
      <div
        className={`option-badge ${
          showCorrect
            ? "badge-correct"
            : showIncorrect
            ? "badge-incorrect"
            : isSelected
            ? "badge-selected"
            : "badge-default"
        }`}
      >
        {alphabet}
      </div>

      {option.image && (
        <img
          src={option.image}
          alt={`Option ${alphabet}`}
          className="option-image"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/150?text=Image+Not+Found")
          }
        />
      )}
      {option.text && <div className="option-text">{option.text}</div>}

      {submitted && isSelected && (
        <div
          className={`option-feedback ${
            option.isCorrect ? "bg-green" : "bg-red"
          }`}
        >
          {option.isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </div>
      )}
    </div>
  );
});

const Feedback = memo(({ isCorrect, feedback }) => (
  <div
    className={`feedback ${
      isCorrect ? "feedback-correct" : "feedback-incorrect"
    }`}
    role="alert"
  >
    {isCorrect ? (
      <>
        <p>
          <strong>✅ Well done! Correct answer!</strong>
        </p>
        {feedback?.correct && <p>{feedback.correct}</p>}
      </>
    ) : (
      <>
        <p>
          <strong>❌ Incorrect answer</strong>
        </p>
        <p>
          {feedback?.incorrect || "Please try again with another question."}
        </p>
      </>
    )}
  </div>
));

const SingleSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const safeData = data || {};
  const options = Array.isArray(safeData.options) ? safeData.options : [];

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext(selected?.isCorrect || false);
  };

  if (!safeData.prompt && options.length === 0) {
    return (
      <div className="error-text">
        Invalid quiz data: No question or options provided
      </div>
    );
  }

  return (
    <div className="single-select-wrapper">
      {safeData.prompt ? (
        <div
          className="question-prompt"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(safeData.prompt),
          }}
          role="region"
          aria-label="Question prompt"
        />
      ) : (
        <div className="error-text">No question provided</div>
      )}

      {options.length > 0 ? (
        <div className="options-grid" role="radiogroup">
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
        <div className="error-text">No options available</div>
      )}

      <div className="action-buttons">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`submit-btn ${selected ? "active" : "disabled"}`}
            disabled={!selected}
            aria-label="Submit answer"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="next-btn"
            aria-label="Next question"
          >
            Next Question
          </button>
        )}
      </div>

      {submitted && (
        <Feedback
          isCorrect={selected?.isCorrect}
          feedback={safeData.feedback}
        />
      )}
    </div>
  );
};

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

export default SingleSelect;
