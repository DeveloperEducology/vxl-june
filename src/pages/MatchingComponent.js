import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type } from "@testing-library/user-event/dist/type";

// ✅ Sample data
const sampleQuestion = {
  instruction: "Match the items on the right with the correct ones on the left",
  hint: "Think about what goes together!",
  type: "matching",

  lessonId: "6877150a6758e304b05066dd",
  leftColumn: [
    { id: 1, type: "text", content: "Apple" },
    { id: 2, type: "text", content: "Dog" },
    {
      id: 3,
      type: "image",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQO1lKKf6qMUPv01kWhR3CbEf2dEaiNudDCg&s",
    },
  ],
  rightColumn: [
    {
      id: "a",
      type: "image",
      content:
        "https://icon2.cleanpng.com/20231206/cvh/transparent-green-leaf-vibrant-red-apple-with-water-droplets-and-1710981820290.webp",
      matchId: 1,
    },
    { id: "c", type: "text", content: "Star", matchId: 3 },
    { id: "b", type: "text", content: "Animal", matchId: 2 },
  ],
};

const MatchingQuiz = ({ question = sampleQuestion, onAnswer }) => {
  const [rightItems, setRightItems] = useState([...question.rightColumn]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dragPreviewRef = useRef(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Reset when question changes
  useEffect(() => {
    setRightItems([...question.rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);
  }, [question]);

  // ✅ Drag & Drop (desktop)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    const newOrder = [...rightItems];
    const [movedItem] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);
    setRightItems(newOrder);
    setHoverIndex(null);
    setDraggedIndex(null);
  };

  // ✅ Check Answer
  const checkAnswer = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    question.leftColumn.forEach((left, index) => {
      const right = rightItems[index];
      if (right && right.matchId === left.id) {
        correctCount++;
      }
    });
    const isCorrect = correctCount === question.leftColumn.length;
    setFeedback(
      isCorrect
        ? "✅ All correct!"
        : `❌ ${correctCount}/${question.leftColumn.length} correct`
    );
    if (onAnswer) onAnswer(isCorrect);
  };

  // ✅ Reset
  const resetQuiz = () => {
    setRightItems([...question.rightColumn]);
    setIsSubmitted(false);
    setFeedback(null);
  };

  const renderContent = (item) => {
    if (item.type === "image") {
      return (
        <img
          src={item.content}
          alt="match"
          className="w-14 h-14 object-cover rounded"
        />
      );
    }
    return <span>{item.content}</span>;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-2 cursor-pointer">
        {question.instruction}
      </h2>

      {/* ✅ Hint toggle */}
      {question.hint && (
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
                Hint: {question.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ✅ Two-column layout */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* LEFT COLUMN (fixed) */}
        <div className="flex flex-col gap-3">
          {question.leftColumn.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              className="p-3 bg-gray-200 rounded flex justify-center items-center min-h-[60px]"
            >
              {renderContent(item)}
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN (draggable) */}
        <div className="flex flex-col gap-3">
          {rightItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              draggable={!isSubmitted}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex justify-center items-center p-4 min-h-[70px] rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-center shadow-md cursor-move select-none transition-all transform hover:scale-105 hover:shadow-lg ${
                draggedIndex === idx ? "opacity-50" : ""
              } ${hoverIndex === idx ? "ring-4 ring-yellow-400" : ""}`}
            >
              {renderContent(item)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ Feedback */}
      {feedback && (
        <div className="mt-4 text-center font-semibold">{feedback}</div>
      )}

      {/* ✅ Action Buttons */}
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
