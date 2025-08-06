import React, { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

const generateRandomNumbers = (count = 5, min = 1, max = 99, unique = true) => {
  const numbers = unique ? new Set() : [];

  while ((unique ? numbers.size : numbers.length) < count) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    unique ? numbers.add(value) : numbers.push(value);
  }

  const finalArray = unique ? Array.from(numbers) : numbers;

  return finalArray.map((value, index) => ({
    id: index + 1,
    value,
  }));
};

const VanillaSortableExample = () => {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState("asc"); // 'asc' or 'desc'
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(90);
  const [score, setScore] = useState(0);

  // Timer logic
  useEffect(() => {
    if (timer === 0) {
      checkAnswer(true); // auto-check if time runs out
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // SortableJS config
  useEffect(() => {
    const sortable = new Sortable(containerRef.current, {
      animation: 150,
      swap: true,
      swapThreshold: 0.75,
      direction: "horizontal",
      onEnd: function (evt) {
        const newItems = [...items];
        const [movedItem] = newItems.splice(evt.oldIndex, 1);
        newItems.splice(evt.newIndex, 0, movedItem);
        setItems(newItems);
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [items]);

  // Generate a new random question
  const generateQuestion = () => {
    const question = generateRandomNumbers(5, 1, 99, true); // Unique;
    const randomOrder = Math.random() > 0.5 ? "asc" : "desc";
    setItems(question);
    setOrderType(randomOrder);
    setFeedback("");
    setTimer(90); // reset timer
  };

// ✅ Validate user answer
const checkAnswer = (auto = false) => {
  const values = items.map((item) => item.value);
  const sorted =
    orderType === "asc"
      ? [...values].sort((a, b) => a - b)
      : [...values].sort((a, b) => b - a);

  const isCorrect = JSON.stringify(values) === JSON.stringify(sorted);

  if (isCorrect && !auto) {
    setScore((prev) => prev + 1);
  }

  setFeedback(
    isCorrect
      ? `✅ Correct! (${orderType.toUpperCase()} order)`
      : `❌ Incorrect. Expected ${orderType.toUpperCase()} order`
  );

  // Auto move to next question after 2 sec
  setTimeout(() => {
    generateQuestion(); // ✅ Correct call
  }, 2000);
};

// ✅ Initial load
useEffect(() => {
  generateQuestion(); // ✅ Correct call
}, []);

  return (
    <div className="max-w-xl mx-auto p-4 text-center font-sans">
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">
        🔢 Sort the Numbers in{" "}
        <span className="underline uppercase">
          {orderType === "asc" ? "Ascending" : "Descending"}
        </span>{" "}
        Order
      </h2>

      <div className="mb-3 text-sm text-gray-700">
        ⏱️ Time Left:{" "}
        <span className="font-semibold text-red-600">{timer}s</span> | 🏆 Score:{" "}
        <span className="font-semibold text-green-600">{score}</span>
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px]"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-blue-500 text-white rounded-md px-3 py-2 text-sm sm:text-base font-bold cursor-grab select-none min-w-[40px] text-center"
          >
            {item.value}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-5 flex-wrap">
        <button
          onClick={generateQuestion}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
        >
          🔁 Skip
        </button>
        <button
          onClick={() => checkAnswer(false)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        >
          ✅ Check Answer
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-4 font-bold text-lg ${
            feedback.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default VanillaSortableExample;
