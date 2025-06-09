import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NumSortingComponent = ({ question, onAnswer, onReset }) => {
  const [currentOrder, setCurrentOrder] = useState([...question.items]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dragPreviewRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  // Text-to-speech functionality
  const [isReading, setIsReading] = useState(false);
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset when question changes
  useEffect(() => {
    setCurrentOrder([...question.items]);
    setIsSubmitted(false);
  }, [question]);

  const resetQuestion = () => {
    setCurrentOrder([...question.items]);
    setIsSubmitted(false);
    onReset();
  };

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);
    setCurrentOrder(newOrder);
    setHoverIndex(null);
  };

  // Mobile touch handlers
  const handleTouchStart = (e, index) => {
    const touch = e.touches[0];
    setDraggedIndex(index);

    const preview = document.createElement("div");
    preview.className =
      "fixed z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none";
    preview.textContent = currentOrder[index];
    preview.style.left = `${touch.clientX - 40}px`;
    preview.style.top = `${touch.clientY - 30}px`;
    document.body.appendChild(preview);
    dragPreviewRef.current = preview;
  };

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];

    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.left = `${touch.clientX - 40}px`;
      dragPreviewRef.current.style.top = `${touch.clientY - 30}px`;
    }

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = element?.closest(".draggable-item");
    const targetIndex = target ? parseInt(target.dataset.index) : null;
    if (targetIndex !== null && targetIndex !== hoverIndex) {
      setHoverIndex(targetIndex);
    }
  };

  const handleTouchEnd = () => {
    if (
      draggedIndex !== null &&
      hoverIndex !== null &&
      draggedIndex !== hoverIndex
    ) {
      const newOrder = [...currentOrder];
      const [movedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(hoverIndex, 0, movedItem);
      setCurrentOrder(newOrder);
    }

    if (dragPreviewRef.current) {
      document.body.removeChild(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }

    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
    const isCorrect =
      JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder);
    onAnswer(isCorrect);
  };

  const renderItem = (item, index) => {
    const isWord = question.type === "words";
    const baseStyles = `draggable-item px-4 py-2 rounded-lg shadow cursor-move select-none
      ${draggedIndex === index ? "opacity-30" : ""}
      ${hoverIndex === index ? "ring-2 ring-yellow-400" : ""}`;

    return (
      <motion.div
        key={index}
        data-index={index}
        draggable={!isSubmitted}
        onDragStart={(e) => !isSubmitted && handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => !isSubmitted && handleDragOver(e, index)}
        onDragLeave={() => setHoverIndex(null)}
        onDrop={(e) => !isSubmitted && handleDrop(e, index)}
        onTouchStart={(e) => !isSubmitted && handleTouchStart(e, index)}
        className={baseStyles}
        style={{
          backgroundColor: isWord ? "#4B5EAA" : "#2D6A4F",
          color: "white",
          minWidth: isWord ? "80px" : "60px",
          textAlign: "center",
        }}
        whileHover={{ scale: !isSubmitted ? 1.05 : 1 }}
        whileTap={{ scale: !isSubmitted ? 0.95 : 1 }}
        role="button"
        aria-label={`${isWord ? "Word" : "Number"}: ${item}`}
        onClick={() => readAloud(item)}
      >
        {item}
      </motion.div>
    );
  };

  return (
    <div
      className="p-1 max-w-md mx-auto"
      onTouchMove={!isSubmitted ? handleTouchMove : undefined}
      onTouchEnd={!isSubmitted ? handleTouchEnd : undefined}
    >
      <div className="mb-4">
        <h2
          className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer"
          onClick={() => readAloud(question?.instruction)}
        >
          {question?.instruction}{" "}
        </h2>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-blue-600 hover:text-blue-800 text-sm"
          aria-label={showHint ? "Hide hint" : "Show hint"}
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>

        {question.hint && (
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 text-sm text-gray-600 italic cursor-pointer"
                onClick={() => readAloud(question?.hint)}
              >
                Hint: {question?.hint}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <motion.div layout className="flex flex-wrap justify-left gap-3 mb-6">
        {currentOrder.map(renderItem)}
      </motion.div>

      {!isSubmitted ? (
        <div className="flex justify-left">
          <button
            onClick={checkAnswer}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
            aria-label="Submit answer"
          >
            Check
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <button
            onClick={resetQuestion}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            aria-label="Try again"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default NumSortingComponent;
