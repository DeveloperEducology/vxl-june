import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MatchingQuiz = ({
  instruction,
  hint,
  leftColumn = [],
  rightColumn = [],
  onAnswer,
}) => {
  const [rightItems, setRightItems] = useState([...rightColumn]);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Touch drag states
  const touchDraggingIndex = useRef(null);

  useEffect(() => {
    setRightItems([...rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [leftColumn, rightColumn]);

  // ✅ Desktop Drag Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDragLeave = () => setDragOverIndex(null);

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (sourceIndex === targetIndex) return;
    swapItems(sourceIndex, targetIndex);
  };

  // ✅ Swap helper
  const swapItems = (sourceIndex, targetIndex) => {
    const newOrder = [...rightItems];
    const [moved] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, moved);
    setRightItems(newOrder);
    setDragOverIndex(null);
  };

  // ✅ Touch Drag Handlers
  const handleTouchStart = (index) => {
    touchDraggingIndex.current = index;
    setDragOverIndex(index);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const dropTarget = element.closest("[data-drop-index]");
    if (dropTarget) {
      const idx = parseInt(dropTarget.dataset.dropIndex, 10);
      setDragOverIndex(idx);
    }
  };

  const handleTouchEnd = () => {
    if (touchDraggingIndex.current !== null && dragOverIndex !== null) {
      swapItems(touchDraggingIndex.current, dragOverIndex);
    }
    touchDraggingIndex.current = null;
    setDragOverIndex(null);
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    leftColumn.forEach((left, idx) => {
      const right = rightItems[idx];
      if (right && right.matchId === left.id) correctCount++;
    });
    const isCorrect = correctCount === leftColumn.length;
    setFeedback(
      isCorrect
        ? "✅ All correct!"
        : `❌ ${correctCount}/${leftColumn.length} correct`
    );
    if (onAnswer) onAnswer(isCorrect);
  };

  const resetQuiz = () => {
    setRightItems([...rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderContent = (item) => {
    if (item?.type === "image") {
      return (
        <img
          src={item.content}
          alt="match"
          className="w-14 h-14 object-cover rounded cursor-pointer"
          onClick={() => readAloud("Image")}
        />
      );
    }
    return (
      <span className="cursor-pointer" onClick={() => readAloud(item?.content)}>
        {item?.content}
      </span>
    );
  };

  return (
    <div className="p-4 max-w-lg mx-auto select-none">
      {/* Instruction */}
      <h2 className="text-lg font-semibold mb-2">{instruction}</h2>

      {/* Hint */}
      {hint && (
        <>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-600 hover:underline text-sm"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm text-gray-500 italic mt-2"
              >
                Hint: {hint}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Columns */}
      <div className="mt-4 flex flex-col gap-3">
        {leftColumn.map((leftItem, idx) => {
          const rightItem = rightItems[idx];

          return (
            <div
              key={leftItem.id}
              className="grid grid-cols-2 gap-4 items-stretch"
            >
              {/* LEFT */}
              <div className="flex justify-center items-center p-3 bg-gray-200 rounded min-h-[70px]">
                {renderContent(leftItem)}
              </div>

              {/* RIGHT */}
              <div
                className={`flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-green-500 text-white shadow-md ${
                  dragOverIndex === idx ? "ring-4 ring-yellow-400" : ""
                }`}
                data-drop-index={idx}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnter={(e) => handleDragEnter(e, idx)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                // ✅ Touch support
                onTouchStart={() => handleTouchStart(idx)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {renderContent(rightItem)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mt-4 text-center font-semibold">{feedback}</div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        {!isSubmitted ? (
          <button
            onClick={checkAnswer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={resetQuiz}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchingQuiz;
