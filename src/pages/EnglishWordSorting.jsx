import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnglishWordSorting({
  question,
  onAnswer,
  onNext,
  onReset,
}) {
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
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const dropTargetRef = useRef(null);

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

  const handleDragStart = (item, e) => {
    setDraggingItem(item);
    if (e?.clientX && e?.clientY) {
      setDraggingCoords({ x: e.clientX, y: e.clientY });
    }
  };

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
    setDragOverTarget(null);
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
    setDragOverTarget(null);
  };

  // ✅ Track mouse move for desktop drag preview
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingItem) {
        setDraggingCoords({ x: e.clientX, y: e.clientY });
      }
    };

    if (draggingItem) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [draggingItem]);

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
        onDragStart={(e) => handleDragStart(item, e)}
        onDragEnd={() => setDraggingItem(null)}
        onTouchStart={(e) => !showFeedback && handleTouchStart(item, e)}
        onTouchMove={!showFeedback ? handleTouchMove : undefined}
        onTouchEnd={!showFeedback ? handleTouchEnd : undefined}
        onClick={() => !useImages && readAloud(item)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
      {/* Drag preview for mouse & touch */}
      <AnimatePresence>
  {draggingItem && (
    <motion.div
      className="fixed z-50 px-4 py-2 rounded-lg shadow-lg pointer-events-none bg-blue-100/80 border border-blue-300"
      style={{
        left: draggingCoords.x,
        top: draggingCoords.y,
        transform: "translate(-50%, -50%)",
        backdropFilter: "blur(4px)", // soft blur effect
      }}
      initial={{ opacity: 0.6, scale: 0.95 }}
      animate={{ opacity: 0.9, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {useImages ? (
        <img
          src={draggingItem}
          alt="drag-preview"
          className="w-16 h-16 object-contain opacity-80"
        />
      ) : (
        <span className="text-blue-800 font-semibold">{draggingItem}</span>
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
          <p className="text-gray-600 text-left text-lg mb-4">
            {question.instruction}
          </p>

          <div
            data-drop-target="available"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverTarget("available");
            }}
            onDragLeave={() => setDragOverTarget(null)}
            onDrop={() => handleDrop("available")}
            className={`p-4 border-2 border-dashed rounded-lg mb-6 min-h-[80px] transition-colors duration-200 ${
              dragOverTarget === "available"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-center mb-2 text-gray-700">
              Available
            </h3>
            <div className="flex flex-wrap justify-left">
              {availableItems.map((item, idx) => renderItem(item, idx))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(question.answers).map((category) => (
              <div
                key={category}
                data-drop-target={category}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverTarget(category);
                }}
                onDragLeave={() => setDragOverTarget(null)}
                onDrop={() => handleDrop(category)}
                className={`p-4 min-h-[80px] border-2 border-dashed rounded-lg transition-colors duration-200 ${
                  dragOverTarget === category
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-400"
                }`}
              >
                <h3 className="font-semibold text-center mb-2">{category}</h3>
                <div className="flex flex-wrap">
                  {answers[category]?.map((item, idx) => renderItem(item, idx))}
                </div>
              </div>
            ))}
          </div>

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
