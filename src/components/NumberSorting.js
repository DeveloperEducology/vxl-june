import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "use-sound";
import correct from "../assets/sounds/correct.mp3";
import incorrect from "../assets/sounds/incorrect.mp3";

const questions = [
  {
    id: 1,
    type: "words",
    lessonId: "682e9f3fa54a951796f4a72b",
    instruction: "Arrange these words to form a correct sentence.",
    items: ["there", "three", "are", "cats"],
    correctOrder: ["there", "are", "three", "cats"],
    hint: "The sentence should describe a quantity of cats.",
  },
  {
    id: 111,
    type: "words",
    lessonId: "682e9f3fa54a951796f4a72b",
    instruction: "Arrange these words to form a correct sentence.",
    items: ["the", "sun", "bright", "is"],
    correctOrder: ["the", "sun", "is", "bright"],
    hint: "It describes a sunny day.",
  },
  {
    id: 113,
    type: "words",
    lessonId: "682e9f3fa54a951796f4a72b",
    instruction: "Arrange these words to form a correct sentence.",
    items: ["playing", "are", "they", "outside"],
    correctOrder: ["they", "are", "playing", "outside"],
    hint: "It talks about kids being outdoors.",
  },

  {
    id: 2,
    type: "match",
    instruction: "Match the countries with their capitals.",
    pairs: [
      { left: "France", right: "Berlin" },
      { left: "Germany", right: "Rome" },
      { left: "Italy", right: "Paris" },
    ],
    correctMatches: {
      France: "Paris",
      Germany: "Berlin",
      Italy: "Rome",
    },
    hint: "Think of famous capital cities in Europe.",
  },
  {
    id: 3,
    type: "match",
    instruction: "Match the animals with their sounds.",
    pairs: [
      { left: "Dog", right: "Meow" },
      { left: "Cat", right: "Neigh" },
      { left: "Horse", right: "Bark" },
    ],
    correctMatches: {
      Dog: "Bark",
      Cat: "Meow",
      Horse: "Neigh",
    },
    hint: "What sound does each animal commonly make?",
  },
  {
    id: 4,
    type: "match",
    instruction: "Match the inventors with their inventions.",
    pairs: [
      { left: "Thomas Edison", right: "Telephone" },
      { left: "Alexander Graham Bell", right: "Light Bulb" },
      { left: "Wright Brothers", right: "Airplane" },
    ],
    correctMatches: {
      "Thomas Edison": "Light Bulb",
      "Alexander Graham Bell": "Telephone",
      "Wright Brothers": "Airplane",
    },
    hint: "Think about what each inventor is famous for.",
  },
  {
    id: 5,
    type: "match",
    instruction: "Match the planets with their position from the sun.",
    pairs: [
      { left: "Mercury", right: "3rd" },
      { left: "Venus", right: "1st" },
      { left: "Earth", right: "2nd" },
    ],
    correctMatches: {
      Mercury: "1st",
      Venus: "2nd",
      Earth: "3rd",
    },
    hint: "Start from the sun and think of the order.",
  },
  {
    id: 6,
    type: "match",
    instruction: "Match the authors with their books.",
    pairs: [
      { left: "J.K. Rowling", right: "The Hobbit" },
      { left: "J.R.R. Tolkien", right: "Hamlet" },
      { left: "William Shakespeare", right: "Harry Potter" },
    ],
    correctMatches: {
      "J.K. Rowling": "Harry Potter",
      "J.R.R. Tolkien": "The Hobbit",
      "William Shakespeare": "Hamlet",
    },
    hint: "Think about famous literature.",
  },
];

const NumberSorting = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [playCorrect] = useSound(correct, { volume: 0.5 });
  const [playIncorrect] = useSound(incorrect, { volume: 0.5 });

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion.type === "match") {
      const shuffledRight = [...currentQuestion.pairs.map((p) => p.right)].sort(
        () => 0.5 - Math.random()
      );
      setMatches({});
      setCurrentOrder(shuffledRight);
    } else {
      setCurrentOrder(currentQuestion.items);
    }
    setFeedback(null);
    setShowHint(false);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    let isCorrect = false;

    if (currentQuestion.type === "match") {
      isCorrect = Object.keys(currentQuestion.correctMatches).every(
        (key) => matches[key] === currentQuestion.correctMatches[key]
      );
    } else {
      isCorrect =
        JSON.stringify(currentOrder) ===
        JSON.stringify(currentQuestion.correctOrder);
    }

    setFeedback({
      isCorrect,
      message: isCorrect
        ? "✅ Correct! Well done!"
        : "❌ Incorrect. Try again!",
    });

    if (isCorrect) {
      setScore(score + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowFinalScore(true);
    }
  };

  const handleMatch = (leftItem, rightItem) => {
    setMatches((prev) => ({ ...prev, [leftItem]: rightItem }));
  };

  const renderMatching = () => {
    const leftItems = currentQuestion.pairs.map((p) => p.left);
    const rightItems = currentOrder;

    return (
      <div className="mt-6">
        <table className="w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Column I</th>
              <th className="p-2">Column II (Select)</th>
            </tr>
          </thead>
          <tbody>
            {leftItems.map((left, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-medium">{left}</td>
                <td className="p-2">
                  <select
                    value={matches[left] || ""}
                    onChange={(e) => handleMatch(left, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">-- Select --</option>
                    {rightItems.map((right, j) => (
                      <option key={j} value={right}>
                        {right}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderItem = (item, index) => {
    const baseStyles = `draggable-item px-4 py-2 rounded-lg shadow cursor-move select-none
      ${draggedIndex === index ? "opacity-30" : ""}
      ${hoverIndex === index ? "ring-2 ring-yellow-400" : ""}`;

    return (
      <motion.div
        key={index}
        data-index={index}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", index);
          setDraggedIndex(index);
          e.target.style.opacity = "0.3";
        }}
        onDragEnd={(e) => {
          e.target.style.opacity = "1";
          setDraggedIndex(null);
          setHoverIndex(null);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setHoverIndex(index);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
          if (sourceIndex === index) return;
          const newOrder = [...currentOrder];
          const [movedItem] = newOrder.splice(sourceIndex, 1);
          newOrder.splice(index, 0, movedItem);
          setCurrentOrder(newOrder);
        }}
        className={baseStyles}
        style={{
          backgroundColor:
            currentQuestion.type === "words" ? "#4B5EAA" : "#2D6A4F",
          color: "white",
          minWidth: "60px",
          textAlign: "center",
        }}
      >
        {item}
      </motion.div>
    );
  };

  if (showFinalScore) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">🎉 Game Over!</h2>
        <p className="mt-4">
          Your final score: {score}/{questions.length}
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowFinalScore(false);
          }}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      {currentQuestion.type === "match" ? (
        <h2 className="text-2xl font-bold mb-4">Match the Items</h2>
      ) : (
        <h2 className="text-2xl font-bold mb-4">
          Sort the Items
          <p style={{ color: "gray", fontSize: 10 }}>
            Hold the word and Move in correct position
          </p>
        </h2>
      )}

      <h3 className="text-xl font-semibold mb-4">
        {currentQuestion.instruction}
      </h3>
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-sm text-blue-600 underline"
      >
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>
      {showHint && <p className="mt-2 text-gray-600">{currentQuestion.hint}</p>}

      {currentQuestion.type === "match" ? (
        renderMatching()
      ) : (
        <div className="flex flex-wrap gap-2 mt-4">
          {currentOrder.map((item, index) => renderItem(item, index))}
        </div>
      )}

      {feedback && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            feedback.isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit
        </button>
        <button
          onClick={handleNextQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NumberSorting;
