import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

const PictureAdditionQuiz = ({ question, onAnswer, onReset }) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Reset state when question changes
  useEffect(() => {
    setAnswer("");
    setIsSubmitted(false);
    setFeedback("");
  }, [question]);

  const handleCheck = () => {
    const correctAnswer = question.number1 + question.number2;
    const isCorrect = parseInt(answer) === correctAnswer;

    setIsSubmitted(true);
    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. The correct answer is ${correctAnswer}.`
    );

    onAnswer(isCorrect);
  };

  const handleReset = () => {
    setAnswer("");
    setIsSubmitted(false);
    setFeedback("");
    onReset();
  };

  const renderImages = (count, imageUrl) => {
    return Array.from({ length: count }, (_, i) => (
      <img
        key={i}
        src={imageUrl}
        alt={`${question.text} icon ${i + 1}`}
        loading="lazy"
        style={question.style}
        className="w-10 h-10 object-contain mx-1"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/64?text=Image+Not+Found")
        }
      />
    ));
  };

  if (!question?.number1 || !question?.number2 || !question?.image) {
    return (
      <div className="text-red-500 py-4 text-center" role="alert">
        Invalid quiz data: Missing required fields
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Question Prompt */}
      <div
        className="mb-6 text-xl font-semibold text-gray-800"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(question.text || question.prompt),
        }}
        role="region"
        aria-label="Question prompt"
      />

      {/* Quiz Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Row 1: First set of images and number */}
        <div className="flex flex-wrap justify-center items-center gap-1">
          {renderImages(question.number1, question.image)}
        </div>
        <div className="flex items-center justify-center text-xl font-medium text-gray-700">
          {question.number1}
        </div>

        {/* Row 2: Second set of images and number */}
        <div className="flex flex-wrap justify-center items-center gap-2 border-t-2 border-gray-300 pt-4">
          {renderImages(question.number2, question.image)}
        </div>
        <div className="flex items-center justify-center text-xl font-medium text-gray-700 border-t-2 border-gray-300 pt-1">
          {question.number2}
        </div>

        {/* Row 3: Equal sign and input */}
        <div className="flex items-center justify-center text-2xl font-bold">
          =
        </div>
        <div className="flex items-center justify-center">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={`
              p-2 border rounded w-20 text-center focus:outline-none focus:ring-2
              ${
                isSubmitted
                  ? feedback.startsWith("✅")
                    ? "border-green-500 focus:ring-green-500"
                    : "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-500"
              }
            `}
            disabled={isSubmitted}
            aria-label="Answer input"
            placeholder="?"
          />
        </div>
      </div>

      <div className="flex justify-left gap-4">
        {!isSubmitted ? (
          <button
            onClick={handleCheck}
            disabled={!answer}
            className={`
            px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300
            ${
              answer
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
            aria-label="Submit answer"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
            aria-label="Try again or next question"
          >
            {feedback.startsWith("✅") ? "Next Question" : "Try Again"}
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`
          mt-6 p-4 rounded-lg text-base animate-fade-in
          ${
            feedback.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
          flex justify-center items-center text-center text-2xl font-bold
            `}
          role="alert"
        >
          {feedback}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

PictureAdditionQuiz.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
    prompt: PropTypes.string,
    number1: PropTypes.number.isRequired,
    number2: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default PictureAdditionQuiz;
