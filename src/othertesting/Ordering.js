import { useState, useEffect } from "react";

export default function Ordering() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize questions with shuffled original arrays and user answers
  useEffect(() => {
    const formattedQuestions = data.flatMap((section) =>
      section.items.map((item) => ({
        type: section.type,
        question: section.question,
        original: [...item.original],
        answer: item.answer,
        userAnswer: [...item.original].sort(() => Math.random() - 0.5), // Shuffle initial order
      }))
    );
    setQuestions(formattedQuestions);
  }, []);

  // Handle drag start
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  // Handle drop
  const handleDrop = (e, dropIndex) => {
    if (draggedItem === null || draggedItem === dropIndex) return;

    const updatedAnswer = [...questions[currentQuestionIndex].userAnswer];
    const [movedItem] = updatedAnswer.splice(draggedItem, 1);
    updatedAnswer.splice(dropIndex, 0, movedItem);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = updatedAnswer;
    setQuestions(updatedQuestions);
    setDraggedItem(null);
  };

  // Check answer
  const checkAnswer = () => {
    const current = questions[currentQuestionIndex];
    const isCorrect =
      JSON.stringify(current.userAnswer) === JSON.stringify(current.answer);
    setShowFeedback(isCorrect ? "correct" : "incorrect");
    setTimeout(() => setShowFeedback(false), 2000);
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
    }
  };

  if (!questions.length)
    return <div className="text-center py-10">Loading...</div>;

  const current = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
          {current.question}
        </h1>

        {/* Draggable list - Horizontal Row of Blue Buttons */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          {current.userAnswer.map((num, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              className={`px-4 py-2 rounded-md cursor-move select-none transition-all duration-200 transform ${
                draggedItem === index
                  ? "bg-blue-400 shadow-md scale-105 opacity-90"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm"
              } text-white font-medium`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`text-center font-semibold mb-4 transition-opacity duration-300 ${
              showFeedback === "correct" ? "text-green-600" : "text-red-600"
            }`}
          >
            {showFeedback === "correct"
              ? "✅ Correct!"
              : "❌ Incorrect! Try again."}
          </div>
        )}

        {/* Controls - Flex Row Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-2 rounded-md font-medium transition-colors w-full sm:w-auto ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={checkAnswer}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
          >
            Check Answer
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`px-5 py-2 rounded-md font-medium transition-colors w-full sm:w-auto ${
              currentQuestionIndex === questions.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Question{" "}
          <span className="font-semibold">{currentQuestionIndex + 1}</span> of{" "}
          <span className="font-semibold">{questions.length}</span>
        </div>
      </div>
    </div>
  );
}

// Sample Data
const data = [
  {
    type: "ordering",
    question: "Arrange the numbers in ascending order.",
    items: [
      { original: [15, 18, 14, 20], answer: [14, 15, 18, 20] },
      { original: [33, 39, 35, 31], answer: [31, 33, 35, 39] },
      { original: [65, 74, 53, 81], answer: [53, 65, 74, 81] },
      { original: [57, 42, 36, 74], answer: [36, 42, 57, 74] },
      { original: [94, 99, 91, 96], answer: [91, 94, 96, 99] },
    ],
  },
  {
    type: "ordering",
    question: "Arrange the numbers in descending order.",
    items: [
      { original: [25, 16, 33, 12], answer: [33, 25, 16, 12] },
      { original: [44, 55, 33, 22], answer: [55, 44, 33, 22] },
      { original: [76, 79, 71, 78], answer: [79, 78, 76, 71] },
      { original: [85, 87, 81, 80], answer: [87, 85, 81, 80] },
      { original: [70, 10, 40, 60], answer: [70, 60, 40, 10] },
    ],
  },
];