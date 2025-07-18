import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MatchingQuiz = ({ instruction, hint, leftColumn = [], rightColumn = [], onAnswer }) => {
  const [rightItems, setRightItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  const draggingIndexRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      // ✅ On mobile, start with empty slots
      setRightItems(new Array(leftColumn.length).fill(null));
    } else {
      // ✅ Desktop keeps original draggable order
      setRightItems([...rightColumn]);
    }
    setIsSubmitted(false);
    setFeedback(null);
  }, [leftColumn, rightColumn]);

  const moveItem = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || sourceIndex == null) return;
    const updated = [...rightItems];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setRightItems(updated);
  };

  const handleDragStart = (e, index) => {
    draggingIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (draggingIndexRef.current !== targetIndex) {
      moveItem(draggingIndexRef.current, targetIndex);
      draggingIndexRef.current = targetIndex;
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = () => (draggingIndexRef.current = null);

  const handleSlotTap = (slotIndex) => {
    setSelectedSlotIndex(slotIndex);
    setModalOpen(true);
  };

  const handleModalSelect = (item) => {
    const updated = [...rightItems];
    updated[selectedSlotIndex] = item;
    setRightItems(updated);
    setModalOpen(false);
    setSelectedSlotIndex(null);
  };

  const getRemainingItems = () => {
    const usedIds = rightItems.filter(Boolean).map((it) => it.id);
    return rightColumn.filter((item) => !usedIds.includes(item.id));
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    leftColumn.forEach((left, idx) => {
      const right = rightItems[idx];
      if (right && right.matchId === left.id) correctCount++;
    });
    const isCorrect = correctCount === leftColumn.length;
    setFeedback(isCorrect ? "✅ All correct!" : `❌ ${correctCount}/${leftColumn.length} correct`);
    if (onAnswer) onAnswer(isCorrect);
  };

  const resetQuiz = () => {
    if (isMobile) {
      setRightItems(new Array(leftColumn.length).fill(null));
    } else {
      setRightItems([...rightColumn]);
    }
    setIsSubmitted(false);
    setFeedback(null);
  };

  const renderContent = (item) => {
    if (!item) return "";
    if (item?.type === "image") {
      return <img src={item.content} alt="match" className="w-14 h-14 object-cover rounded" />;
    }
    return <span>{item.content}</span>;
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
      <h2 className="text-lg font-semibold mb-2">{instruction}</h2>

      {hint && (
        <>
          <button onClick={() => setShowHint(!showHint)} className="text-blue-600 hover:underline text-sm">
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

      <motion.div layout className="mt-4 flex flex-col gap-3">
        {leftColumn.map((leftItem, idx) => {
          const rightItem = rightItems[idx];

          return (
            <motion.div layout key={leftItem.id} className="grid grid-cols-2 gap-4 items-stretch">
              <div className="flex justify-center items-center p-3 bg-gray-200 rounded min-h-[70px]">
                {renderContent(leftItem)}
              </div>

              {!isMobile ? (
                <div
                  className="flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-green-500 text-white shadow-md cursor-move"
                  data-drop-index={idx}
                  draggable={!isSubmitted}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {renderContent(rightItem)}
                </div>
              ) : (
                <button
                  onClick={() => handleSlotTap(idx)}
                  className="flex justify-center items-center p-4 rounded-lg min-h-[70px] bg-blue-500 text-white shadow-md"
                >
                  {rightItem ? renderContent(rightItem) : "Tap to Select"}
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {feedback && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center font-semibold">
          {feedback}
        </motion.div>
      )}

      <div className="flex gap-3 mt-4">
        {!isSubmitted ? (
          <button onClick={checkAnswer} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        ) : (
          <button onClick={resetQuiz} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Try Again
          </button>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-4 max-w-sm w-full shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3">Select an Item</h3>
              <div className="grid grid-cols-2 gap-3">
                {getRemainingItems().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleModalSelect(item)}
                    className="p-3 border rounded hover:bg-gray-100"
                  >
                    {renderContent(item)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-4 w-full bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingQuiz;
