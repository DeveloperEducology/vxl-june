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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Dragging state
  const draggingIndexRef = useRef(null);
  const draggingItemRef = useRef(null);

  // Ghost preview (mobile)
  const [ghostPos, setGhostPos] = useState(null);

  useEffect(() => {
    setRightItems([...rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);
  }, [leftColumn, rightColumn]);

  // ✅ Move item from sourceIndex → targetIndex (live reorder)
  const moveItem = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || sourceIndex == null) return;
    const updated = [...rightItems];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setRightItems(updated);
  };

  // ✅ Desktop Drag Handlers
  const handleDragStart = (e, index) => {
    draggingIndexRef.current = index;
    draggingItemRef.current = rightItems[index];
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    // Reorder live
    if (draggingIndexRef.current !== targetIndex) {
      moveItem(draggingIndexRef.current, targetIndex);
      draggingIndexRef.current = targetIndex; // now dragging item sits at new position
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    draggingIndexRef.current = null;
    draggingItemRef.current = null;
  };

  // ✅ Mobile Touch Handlers
  const handleTouchStart = (index) => {
    draggingIndexRef.current = index;
    draggingItemRef.current = rightItems[index];

    setGhostPos({ x: 0, y: 0 });
    document.body.style.overflow = "hidden"; // disable scroll
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    setGhostPos({ x: touch.clientX, y: touch.clientY });

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const dropTarget = el.closest("[data-drop-index]");
    if (dropTarget) {
      const targetIndex = parseInt(dropTarget.dataset.dropIndex, 10);

      if (targetIndex !== draggingIndexRef.current) {
        moveItem(draggingIndexRef.current, targetIndex);
        draggingIndexRef.current = targetIndex;
      }
    }
  };

  const handleTouchEnd = () => {
    draggingIndexRef.current = null;
    draggingItemRef.current = null;
    setGhostPos(null);
    document.body.style.overflow = ""; // re-enable scroll
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
    <div className="p-4 max-w-lg mx-auto select-none relative">
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

      {/* Two-column Matching Layout */}
      <motion.div layout className="mt-4 flex flex-col gap-3">
        {leftColumn.map((leftItem, idx) => {
          const rightItem = rightItems[idx];

          return (
            <motion.div
              layout
              key={leftItem.id}
              className="grid grid-cols-2 gap-4 items-stretch"
            >
              {/* LEFT COLUMN */}
              <motion.div
                layout
                className="flex justify-center items-center p-3 bg-gray-200 rounded min-h-[70px]"
              >
                {renderContent(leftItem)}
              </motion.div>

              {/* RIGHT COLUMN (Draggable / Live reorder) */}
              <motion.div
                layout
                className={`flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-green-500 text-white shadow-md transition-all`}
                data-drop-index={idx}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnter={(e) => handleDragEnter(e, idx)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                // Mobile Touch Live reorder
                onTouchStart={() => handleTouchStart(idx)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {renderContent(rightItem)}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-semibold"
        >
          {feedback}
        </motion.div>
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

      {/* ✅ Mobile Ghost Preview */}
      <AnimatePresence>
        {ghostPos && draggingItemRef.current && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{
              x: ghostPos.x,
              y: ghostPos.y,
              scale: 1,
              opacity: 0.9,
              transition: { type: "spring", stiffness: 200, damping: 20 },
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed top-0 left-0 z-50 pointer-events-none"
            style={{
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div className="p-4 bg-green-600 text-white rounded-lg shadow-lg">
              {renderContent(draggingItemRef.current)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingQuiz;
