import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnglishWordSorting({
  question,
  onAnswer,
  onNext,
  onReset,
}) {
  // ✅ Choose correct source (images or words)
  const initialSource =
    question.images?.length > 0
      ? question.images.map((img) => img.url)
      : question.words;

  const [availableItems, setAvailableItems] = useState([...initialSource]);
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(Object.keys(question.answers).map((key) => [key, []]))
  );
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingCoords, setDraggingCoords] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const dropTargetRef = useRef(null);

  // Text-to-speech (only for words)
  const [isReading, setIsReading] = useState(false);
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const useImages = question.images && question.images.length > 0;

  // ✅ Reset when question changes
  useEffect(() => {
    const source =
      question.images?.length > 0
        ? question.images.map((img) => img.url)
        : question.words;
    setAvailableItems([...source]);
    setAnswers(
      Object.fromEntries(Object.keys(question.answers).map((key) => [key, []]))
    );
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDraggingItem(null);
  }, [question]);

  const handleDragStart = (item) => setDraggingItem(item);

  const handleDrop = (target) => {
    if (!draggingItem) return;

    setAvailableItems((prev) => prev.filter((w) => w !== draggingItem));
    setAnswers((prev) => {
      const updated = { ...prev };
      for (let key in updated) {
        updated[key] = updated[key].filter((w) => w !== draggingItem);
      }
      return updated;
    });

    if (target === "available") {
      setAvailableItems((prev) => [...prev, draggingItem]);
    } else {
      setAnswers((prev) => ({
        ...prev,
        [target]: prev[target].includes(draggingItem)
          ? prev[target]
          : [...prev[target], draggingItem],
      }));
    }

    setDraggingItem(null);
  };

  const handleTouchStart = (item, e) => {
    e.preventDefault();
    setDraggingItem(item);
  };

  const handleTouchMove = (e) => {
    if (!draggingItem) return;
    const touch = e.touches[0];
    setDraggingCoords({ x: touch.clientX, y: touch.clientY });

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = element?.closest("[data-drop-target]");
    dropTargetRef.current = dropTarget ? dropTarget.dataset.dropTarget : null;
  };

  const handleTouchEnd = () => {
    if (draggingItem && dropTargetRef.current) {
      handleDrop(dropTargetRef.current);
    }
    setDraggingItem(null);
    dropTargetRef.current = null;
  };

  const checkAnswers = () => {
    setIsSubmitted(true);

    let correct = true;
    for (const [category, correctItems] of Object.entries(question.answers)) {
      const userItems = answers[category] || [];
      if (
        userItems.length !== correctItems.length ||
        !correctItems.every((item) => userItems.includes(item))
      ) {
        correct = false;
        break;
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct);
    if (correct) setTimeout(onNext, 1500);
  };

  const resetQuestion = () => {
    const source =
      question.images?.length > 0
        ? question.images.map((img) => img.url)
        : question.words;
    setAvailableItems([...source]);
    setAnswers(
      Object.fromEntries(Object.keys(question.answers).map((key) => [key, []]))
    );
    setIsSubmitted(false);
    setShowFeedback(false);
    onReset();
  };

  const renderItem = (item, index, isCorrectAnswer = false) => {
    const commonClasses = `px-3 py-2 m-1 rounded-lg shadow-md text-sm sm:text-base font-medium flex justify-center items-center`;

    const finalClass = `${commonClasses} ${
      showFeedback ? "cursor-default" : "cursor-move touch-none"
    } ${
      isSubmitted &&
      !(
        question.words?.includes(item) ||
        question.images?.map((i) => i.url).includes(item)
      )
        ? isCorrect
          ? "bg-white-200 text-green-800"
          : "bg-red-200 text-red-800"
        : isCorrectAnswer
        ? "bg-green-200 text-green-800"
        : "bg-blue-200 text-blue-800"
    }`;

    return (
      <motion.div
        key={item}
        draggable={!showFeedback}
        onDragStart={() => handleDragStart(item)}
        onDragEnd={() => setDraggingItem(null)}
        onTouchStart={(e) => !showFeedback && handleTouchStart(item, e)}
        onTouchMove={!showFeedback ? handleTouchMove : undefined}
        onTouchEnd={!showFeedback ? handleTouchEnd : undefined}
        onClick={() => !useImages && readAloud(item)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        // transition={{ type: "spring", stiffness: 300 }}
        layout
        className={finalClass}
      >
        {useImages ? (
          <img
            src={item}
            alt={`image-${index}`}
            className="w-16 h-16 object-contain"
          />
        ) : (
          item
        )}
      </motion.div>
    );
  };

  return (
    <div
      className="p-4 sm:p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg"
      onTouchMove={!showFeedback ? handleTouchMove : undefined}
      onTouchEnd={!showFeedback ? handleTouchEnd : undefined}
    >
      {/* Drag preview for mobile */}
      <AnimatePresence>
        {draggingItem && (
          <motion.div
            className="fixed z-50 px-4 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: draggingCoords.x,
              top: draggingCoords.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {useImages ? (
              <img
                src={draggingItem}
                alt="drag-preview"
                className="w-16 h-16 object-contain"
              />
            ) : (
              draggingItem
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback ? (
        <div className="text-center">
          <h2
            className={`text-xl sm:text-2xl font-bold mb-4 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect
              ? "Correct!"
              : "Incorrect - Here are the correct answers"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.entries(question.answers).map(
              ([category, correctItems]) => (
                <div
                  key={category}
                  className="p-4 border border-gray-200 rounded-lg bg-green-50 min-h-[80px]"
                >
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {correctItems.map((item, idx) =>
                      renderItem(item, idx, true)
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={resetQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            {!isCorrect && (
              <motion.button
                onClick={onNext}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Question
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Show Instruction */}
          <p className="text-gray-600 text-left text-lg mb-4">
            {question.instruction}
          </p>

          {/* Available Items */}
          <div className="flex flex-wrap justify-left mb-6">
            {availableItems.map((item, idx) => renderItem(item, idx))}
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(question.answers).map((category) => (
              <div
                key={category}
                data-drop-target={category}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(category)}
                className="p-4 min-h-[80px] border-2 border-dashed border-gray-400 rounded-lg"
              >
                <h3 className="font-semibold text-center mb-2">{category}</h3>
                <div className="flex flex-wrap">
                  {answers[category]?.map((item, idx) => renderItem(item, idx))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="text-center mt-6">
            <motion.button
              onClick={checkAnswers}
              className={`px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
