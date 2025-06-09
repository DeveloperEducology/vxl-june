import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EnglishWordSorting = ({ question, onAnswer, onNext, onReset }) => {
  const [availableWords, setAvailableWords] = useState([...question.words]);
  const [answers, setAnswers] = useState(() => {
    return Object.fromEntries(
      Object.keys(question.answers).map((key) => [key, []])
    );
  });
  const [draggingWord, setDraggingWord] = useState(null);
  const [draggingCoords, setDraggingCoords] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const dropTargetRef = useRef(null);

  // Text-to-speech
  const [isReading, setIsReading] = useState(false);
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setAvailableWords([...question.words]);
    setAnswers(
      Object.fromEntries(Object.keys(question.answers).map((key) => [key, []]))
    );
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDraggingWord(null);
  }, [question]);

  const handleDragStart = (word) => {
    setDraggingWord(word);
  };

  const handleDrop = (target) => {
    if (!draggingWord) return;

    // Remove from previous
    setAvailableWords((prev) => prev.filter((w) => w !== draggingWord));
    setAnswers((prev) => {
      const updated = { ...prev };
      for (let key in updated) {
        updated[key] = updated[key].filter((w) => w !== draggingWord);
      }
      return updated;
    });

    if (target === "available") {
      setAvailableWords((prev) => [...prev, draggingWord]);
    } else {
      setAnswers((prev) => ({
        ...prev,
        [target]: prev[target].includes(draggingWord)
          ? prev[target]
          : [...prev[target], draggingWord],
      }));
    }

    setDraggingWord(null);
  };

  // Touch Events
  const handleTouchStart = (word, e) => {
    e.preventDefault();
    setDraggingWord(word);
  };

  const handleTouchMove = (e) => {
    if (!draggingWord) return;

    const touch = e.touches[0];
    setDraggingCoords({ x: touch.clientX, y: touch.clientY });

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = element?.closest("[data-drop-target]");
    if (dropTarget) {
      dropTargetRef.current = dropTarget.dataset.dropTarget;
    } else {
      dropTargetRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (draggingWord && dropTargetRef.current) {
      handleDrop(dropTargetRef.current);
    }
    setDraggingWord(null);
    dropTargetRef.current = null;
  };

  const checkAnswers = () => {
    if (availableWords.length > 0) return;

    setIsSubmitted(true);

    let correct = true;
    for (const [category, correctWords] of Object.entries(question.answers)) {
      const userWords = answers[category] || [];
      if (
        userWords.length !== correctWords.length ||
        !correctWords.every((word) => userWords.includes(word))
      ) {
        correct = false;
        break;
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct);
  };

  const resetQuestion = () => {
    setAvailableWords([...question.words]);
    setAnswers(
      Object.fromEntries(Object.keys(question.answers).map((key) => [key, []]))
    );
    setIsSubmitted(false);
    setShowFeedback(false);
    onReset();
  };

  const renderWord = (word, isCorrectAnswer = false) => (
    <motion.div
      key={word}
      draggable={!showFeedback}
      onDragStart={() => handleDragStart(word)}
      onDragEnd={() => setDraggingWord(null)}
      onTouchStart={(e) => !showFeedback && handleTouchStart(word, e)}
      onTouchMove={!showFeedback ? handleTouchMove : undefined}
      onTouchEnd={!showFeedback ? handleTouchEnd : undefined}
      className={`p-2 m-1 rounded shadow ${
        showFeedback ? "cursor-default" : "cursor-move touch-none"
      } ${
        isSubmitted && !question.words.includes(word)
          ? isCorrect
            ? "bg-green-200"
            : "bg-red-200"
          : isCorrectAnswer
          ? "bg-green-200"
          : "bg-blue-200"
      }`}
      onClick={() => readAloud(word)}
      layout
    >
      <h2>

      {word}
      </h2>
    </motion.div>
  );

  return (
    <div
      className="p-4 max-w-3xl mx-auto relative"
      onTouchMove={!showFeedback ? handleTouchMove : undefined}
      onTouchEnd={!showFeedback ? handleTouchEnd : undefined}
    >
      {/* Drag preview for mobile */}
      <AnimatePresence>
        {draggingWord && (
          <motion.div
            className="fixed z-50 px-4 py-2 bg-blue-300 rounded shadow-lg pointer-events-none"
            style={{
              left: draggingCoords.x,
              top: draggingCoords.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {draggingWord}
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback ? (
        <div className="text-center">
          <h2
            className={`text-xl font-bold mb-4 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect
              ? "Correct!"
              : "Incorrect - Here are the correct answers"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.entries(question.answers).map(
              ([category, correctWords]) => (
                <div
                  key={category}
                  className="p-4 border border-gray-400 rounded bg-green-50 min-h-[60px]"
                >
                  <h3 className="font-semibold">{category}</h3>
                  <div className="flex flex-wrap mt-2">
                    {correctWords.map((word) => renderWord(word, true))}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-bold">{question.instruction}</h2>
          </div>

          <div
            data-drop-target="available"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("available")}
            className="p-4 mb-4 border border-dashed border-gray-400 rounded bg-gray-100 min-h-[60px]"
          >
            <h3 className="font-semibold mb-2">Available Words</h3>
            <div className="flex flex-wrap">
              {availableWords.map(renderWord)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.keys(answers).map((key) => (
              <div
                key={key}
                data-drop-target={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(key)}
                className="p-4 border border-dashed border-gray-400 rounded bg-green-50 min-h-[60px]"
              >
                <h3 className="font-semibold">{key}</h3>
                <div className="flex flex-wrap mt-2">
                  {answers[key].map(renderWord)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={checkAnswers}
            disabled={availableWords.length > 0}
            className={`px-4 py-2 rounded text-white ${
              availableWords.length > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Check Answers
          </button>

          {availableWords.length > 0 && (
            <p className="mt-2 text-sm text-red-500">
              Please sort all words before submitting.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default EnglishWordSorting;
