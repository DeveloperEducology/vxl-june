import React, { useState, useEffect } from "react";
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

  const [selectingIndex, setSelectingIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Speech function
  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // ✅ Reset when props change
  useEffect(() => {
    setRightItems([...rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [leftColumn, rightColumn]);

  // ✅ Drag handlers (MDN-style)
  const handleDragStart = (e, index) => {
    // Store dragged index in dataTransfer
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault(); // required to allow drop
    setDragOverIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // must prevent default to allow drop
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (sourceIndex === targetIndex) return;

    const newOrder = [...rightItems];
    const [movedItem] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

    setRightItems(newOrder);
    setDragOverIndex(null);
  };

  // ✅ Check answers
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

  // ✅ Render text/image content
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

  // ✅ Mobile modal picker
  const handleSelectOption = (selectedItem) => {
    if (selectingIndex === null) return;
    const updated = [...rightItems];
    updated[selectingIndex] = selectedItem;
    setRightItems(updated);
    setSelectingIndex(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
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

      {/* Matching Columns */}
      <div className="mt-4 flex flex-col gap-3">
        {leftColumn.map((leftItem, idx) => {
          const rightItem = rightItems[idx];

          return (
            <div
              key={leftItem.id}
              className="grid grid-cols-2 gap-4 items-stretch"
            >
              {/* LEFT ITEM */}
              <div className="flex justify-center items-center p-3 bg-gray-200 rounded min-h-[70px]">
                {renderContent(leftItem)}
              </div>

              {/* RIGHT ITEM */}
              {isMobile ? (
                // ✅ MOBILE: Tap to select
                <button
                  className="flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-green-600 text-white shadow-md"
                  onClick={() => setSelectingIndex(idx)}
                  disabled={isSubmitted}
                >
                  {rightItem ? renderContent(rightItem) : "Select Match"}
                </button>
              ) : (
                // ✅ DESKTOP: Drag & Drop
                <div
                  className={`flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-green-500 text-white shadow-md select-none ${
                    dragOverIndex === idx ? "ring-4 ring-yellow-400" : ""
                  }`}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, idx)}
                >
                  {renderContent(rightItem)}
                </div>
              )}
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

      {/* ✅ Mobile modal for selecting right item */}
      {isMobile && selectingIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Select an option</h3>
            <div className="flex flex-col gap-2">
              {rightColumn.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectOption(item)}
                  className="p-3 border rounded hover:bg-gray-100"
                >
                  {renderContent(item)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectingIndex(null)}
              className="mt-3 w-full text-center text-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingQuiz;
