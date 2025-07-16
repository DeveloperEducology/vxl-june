
    import React, { useState, useRef } from "react";
    import { createRoot } from "react-dom/client";
    import { AnimatePresence, motion } from "framer-motion";

    const Letter = ({ letter, x, y, onDrag, onDragEnd, isDragging }) => {
      return (
        <motion.div
          className={`bg-blue-600 text-white rounded-lg p-2 m-1 cursor-move select-none
            ${isDragging ? 'shadow-xl scale-110' : 'shadow-md'}`}
          drag
          dragMomentum={false}
          dragElastic={0.1}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          style={{
            x,
            y,
            width: '2.5rem', // 40px, scales with screen size
            height: '2.5rem',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: isDragging ? 10 : 1,
            fontSize: '1.25rem', // Readable on mobile
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {letter}
        </motion.div>
      );
    };

    const Box = ({ title, children, isDraggingOver, id, onDragOver }) => {
      return (
        <motion.div
          id={id}
          className={`border-2 border-blue-600 p-4 rounded-lg flex flex-col items-center 
            justify-center w-full max-w-[16rem] h-56 sm:h-64 transition-colors duration-200
            ${isDraggingOver ? 'bg-blue-50 border-blue-800' : 'bg-white'}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          onDragOver={onDragOver}
        >
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2 text-blue-600"
            >
              <path d="M18.75 4.5l-1.89 1.9c-.83.84-2.09 1.36-3.44 1.36H9.83c-1.35 0-2.61-.52-3.44-1.36L5.25 4.5c-.78-.79-.78-2.04 0-2.83s2.04-.79 2.83 0l1.89 1.9h8.42c.79 0 1.5.51 2.29 1.31S19.53 3.71 18.75 4.5zm-3.75 7.5c0-.97-.39-1.85-.97-2.5l1.89-1.9c.83-.84 2.09-1.36 3.44-1.36h1.35c1.35 0 2.61.52 3.44 1.36l-1.89 1.9c-.78.79-.78 2.04 0 2.83s2.04.79 2.83 0l1.89-1.9h-8.42c-.79 0-1.5-.51-2.29-1.31S12.15 12.07 11.25 11.1z" />
            </svg>
            <span className="font-semibold text-base sm:text-lg text-gray-800">{title}</span>
          </div>
          <div className="flex flex-wrap justify-center">{children}</div>
        </motion.div>
      );
    };

    const SortingWords = () => {
      const questions = [
        {
          id: 1,
          letters: [
            { id: "d1", letter: "d", x: 0, y: 0, box: null },
            { id: "s1", letter: "s", x: 50, y: 0, box: null },
            { id: "e1", letter: "e", x: 100, y: 0, box: null },
          ],
          correctVowels: ["e"],
          correctConsonants: ["d", "s"],
        },
        {
          id: 2,
          letters: [
            { id: "a2", letter: "a", x: 0, y: 0, box: null },
            { id: "b2", letter: "b", x: 50, y: 0, box: null },
            { id: "t2", letter: "t", x: 100, y: 0, box: null },
          ],
          correctVowels: ["a"],
          questionConsonants: ["b", "t"],
        },
        {
          id: 3,
          letters: [
            { id: "i3", letter: "i", x: 0, y: 0, box: null },
            { id: "m3", letter: "m", x: 50, y: 0, box: null },
            { id: "p3", letter: "p", x: 100, y: 0, box: null },
          ],
          correctVowels: ["i"],
          correctConsonants: ["m", "p"],
        },
      ];

      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [letters, setLetters] = useState(questions[0].letters);
      const [consonants, setConsonants] = useState([]);
      const [vowels, setVowels] = useState([]);
      const [draggingId, setDraggingId] = useState(null);
      const [dragOverBox, setDragOverBox] = useState(null);
      const [quizResult, setQuizResult] = useState(null);
      const [score, setScore] = useState(0);
      const [quizCompleted, setQuizCompleted] = useState(false);
      const initialLetters = useRef(questions.map((q) => q.letters)).current;

      const handleDragStart = (id) => {
        setDraggingId(id);
      };

      const handleDrag = (id, event, info) => {
        const newLetters = letters.map((letter) =>
          letter.id === id ? { ...letter, x: info.point.x, y: info.point.y } : letter
        );
        setLetters(newLetters);
      };

      const handleDragEnd = (id, event, info) => {
        setDraggingId(null);
        setDragOverBox(null);

        const consonantBox = document.getElementById("consonants-box");
        const vowelBox = document.getElementById("vowels-box");
        
        const { x, y } = info.point;
        let targetBox = null;

        if (consonantBox?.getBoundingClientRect) {
          const consonantRect = consonantBox.getBoundingClientRect();
          const vowelRect = vowelBox.getBoundingClientRect();

          if (
            x >= consonantRect.left &&
            x <= consonantRect.right &&
            y >= consonantRect.top &&
            y <= consonantRect.bottom
          ) {
            targetBox = "consonants";
          } else if (
            x >= vowelRect.left &&
            x <= vowelRect.right &&
            y >= vowelRect.top &&
            y <= vowelRect.bottom
          ) {
            targetBox = "vowels";
          }
        }

        const newLetters = letters.map((letter) => {
          if (letter.id === id) {
            if (targetBox) {
              return { ...letter, box: targetBox, x: 0, y: 0 };
            }
            return { ...letter, x: letter.x - letter.x % 50, y: 0, box: null };
          }
          return letter;
        });

        setLetters(newLetters);

        if (targetBox === "consonants") {
          if (!consonants.includes(id)) {
            setConsonants([...consonants, id]);
            setVowels(vowels.filter((vowelId) => vowelId !== id));
          }
        } else if (targetBox === "vowels") {
          if (!vowels.includes(id)) {
            setVowels([...vowels, id]);
            setConsonants(consonants.filter((consonantId) => consonantId !== id));
          }
        } else {
          setConsonants(consonants.filter((consonantId) => consonantId !== id));
          setVowels(vowels.filter((vowelId) => vowelId !== id));
        }

        setQuizResult(null);
      };

      const handleDragOver = (boxId, event) => {
        event.preventDefault();
        setDragOverBox(boxId);
      };

      const resetQuestion = () => {
        setLetters(initialLetters[currentQuestionIndex]);
        setConsonants([]);
        setVowels([]);
        setDragOverBox(null);
        setDraggingId(null);
        setQuizResult(null);
      };

      const validateAnswers = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const correctVowels = currentQuestion.correctVowels;
        const correctConsonants = currentQuestion.correctConsonants || currentQuestion.questionConsonants; // Handle typo in Q2

        const placedVowels = vowels
          .map((id) => letters.find((l) => l.id === id)?.letter)
          .filter(Boolean);
        const placedConsonants = consonants
          .map((id) => letters.find((l) => l.id === id)?.letter)
          .filter(Boolean);

        const isVowelsCorrect =
          placedVowels.length === correctVowels.length &&
          placedVowels.every((letter) => correctVowels.includes(letter)) &&
          correctVowels.every((letter) => placedVowels.includes(letter));

        const isConsonantsCorrect =
          placedConsonants.length === correctConsonants.length &&
          placedConsonants.every((letter) => correctConsonants.includes(letter)) &&
          correctConsonants.every((letter) => placedConsonants.includes(letter));

        const allPlaced = letters.every((letter) => letter.box !== null);

        if (!allPlaced) {
          setQuizResult({
            isCorrect: false,
            message: "Please place all letters into the boxes before submitting.",
          });
        } else if (isVowelsCorrect && isConsonantsCorrect) {
          setQuizResult({
            isCorrect: true,
            message: "Correct! Moving to the next question...",
          });
          setScore(score + 1);
          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              setLetters(questions[currentQuestionIndex + 1].letters);
              setConsonants([]);
              setVowels([]);
              setQuizResult(null);
            } else {
              setQuizCompleted(true);
            }
          }, 1500);
        } else {
          setQuizResult({
            isCorrect: false,
            message: "Incorrect. Try again or reset the question.",
          });
        }
      };

      const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setLetters(questions[0].letters);
        setConsonants([]);
        setVowels([]);
        setDragOverBox(null);
        setDraggingId(null);
        setQuizResult(null);
        setScore(0);
        setQuizCompleted(false);
      };

      if (quizCompleted) {
        return (
          <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4">
                Your score: {score} out of {questions.length}
              </p>
              <p className="text-sm sm:text-md text-gray-500 mb-6">
                {score === questions.length
                  ? "Perfect! You sorted all letters correctly."
                  : "Good effort! Try again to improve your score."}
              </p>
              <motion.button
                onClick={restartQuiz}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Restart Quiz
              </motion.button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-100 min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Letter Sorting Quiz
              </h2>
              <div className="text-gray-600 text-sm sm:text-base">
                Question {currentQuestionIndex + 1} of {questions.length} | Score: {score}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 sm:mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {quizResult && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 sm:p-4 rounded-lg w-full text-center mb-4 sm:mb-6
                  ${quizResult.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {quizResult.message}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <motion.button
                onClick={validateAnswers}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Answer
              </motion.button>
              <motion.button
                onClick={resetQuestion}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Question
              </motion.button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
              <Box
                title="Consonants"
                id="consonants-box"
                isDraggingOver={dragOverBox === "consonants"}
                onDragOver={(e) => handleDragOver("consonants", e)}
              >
                <AnimatePresence>
                  {consonants.map((id) => {
                    const letter = letters.find((l) => l.id === id);
                    return letter && (
                      <Letter
                        key={id}
                        letter={letter.letter}
                        x={letter.x}
                        y={letter.y}
                        onDrag={(e, info) => handleDrag(id, e, info)}
                        onDragEnd={(e, info) => handleDragEnd(id, e, info)}
                        isDragging={draggingId === id}
                      />
                    );
                  })}
                </AnimatePresence>
              </Box>

              <Box
                title="Vowels"
                id="vowels-box"
                isDraggingOver={dragOverBox === "vowels"}
                onDragOver={(e) => handleDragOver("vowels", e)}
              >
                <AnimatePresence>
                  {vowels.map((id) => {
                    const letter = letters.find((l) => l.id === id);
                    return letter && (
                      <Letter
                        key={id}
                        letter={letter.letter}
                        x={letter.x}
                        y={letter.y}
                        onDrag={(e, info) => handleDrag(id, e, info)}
                        onDragEnd={(e, info) => handleDragEnd(id, e, info)}
                        isDragging={draggingId === id}
                      />
                    );
                  })}
                </AnimatePresence>
              </Box>
            </div>

            <div className="flex flex-wrap justify-center space-x-2 mt-4 sm:mt-8">
              <AnimatePresence>
                {letters.map(({ id, letter, x, y, box }) => {
                  if (!box) {
                    return (
                      <Letter
                        key={id}
                        letter={letter}
                        x={x}
                        y={y}
                        onDrag={(e, info) => {
                          handleDragStart(id);
                          handleDrag(id, e, info);
                        }}
                        onDragEnd={(e, info) => handleDragEnd(id, e, info)}
                        isDragging={draggingId === id}
                      />
                    );
                  }
                  return null;
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    };


export default SortingWords;