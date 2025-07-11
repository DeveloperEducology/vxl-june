import React, { useState, useEffect, useCallback } from "react";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UploadingAnimation from "../assets/uploading.gif";
import NumberLineQuestion from "./NumberLineQuestion";
import EnglishWordSorting from "./EnglishWordSorting";
import NumSortingComponent from "./NumSortingComponent";
import SingleMathQuiz from "./SingleMathQuiz";
import SingleSelect from "../pages/SingleSelect";
import PictureAdditionQuiz from "./PictureAdditionQuiz";
import SingleMathQuizTest from "./SingleMathQuizTest";
import MultiSelect from "./MultiSelect";
import PictureMCQ from "../othertesting/sss";
import SolutionBox from "../components/Solutionbox";
import Multiplication from "../components/Multiplication";
import Addition from "../components/Addition";
import Subtraction from "../components/Subtraction";
import EquationMCQ from "../othertesting/EquationMCQ";
import EquationRenderer from "../othertesting/EquationRenderer";

const Quiz = () => {
  const navigate = useNavigate();
  const { classId, subjectId, lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [lessonName, setLessonName] = useState("");
  const [feedback, setFeedback] = useState({});
  const [showQuestion, setShowQuestion] = useState(true);
  const [filledSequences, setFilledSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingImage] = useState(UploadingAnimation);
  const [showSolution, setShowSolution] = useState(false);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);

  // Score state
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);

  // State for math quiz
  const [mathAnswers, setMathAnswers] = useState({});
  const [mathSubmitted, setMathSubmitted] = useState(false);
  const [mathScore, setMathScore] = useState({
    correct: 0,
    total: 0,
    percentage: 0,
  });

  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState({
    correct: 0,
    total: 0,
    percentage: 0,
  });

  const onSubmit = (question) => {
    let correct = 0;
    let total = 0;

    question.pieces.forEach((expr) => {
      if (expr.objectType === "QMInput") {
        total++;
        const userAnswer = answers[question._id]?.[expr.id] || "";
        if (String(userAnswer).trim() === String(expr.correctAnswer).trim()) {
          correct++;
        }
      }
    });
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswers({});
    }, 1000); // Simulate processing delay

    const percentage = total > 0 ? (correct / total) * 100 : 0;
    setScore({ correct, total, percentage });
    setSubmitted(true);
  };

  const onReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore({ correct: 0, total: 0, percentage: 0 });
  };

  // Text-to-speech
  const [isReading, setIsReading] = useState(false);
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const questionsRes = await axios.get(
          // `http://localhost:5000/api/questions?lessonId=${lessonId}`
          `https://ilx-backend.onrender.com/api/questions?lessonId=${lessonId}`
        );
        // console.log("Response from API:", questionsRes.data);
        const fetchedQuestions = questionsRes.data.questions;
        const lesson = questionsRes.data.lesson;
        console.log("Fetched questions:", fetchedQuestions);

        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setLessonName(lesson.name);
          setError(null);
        } else {
          setQuestions([]);
          setError("No questions available for this lesson.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
        setQuestions([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  // console.log("lessonname:", lessonName);

  const question = questions[currentQuestionIndex];

  const initializeUserAnswer = (question) => {
    if (question.type === "fill-in-sequence" || question.type === "sequence") {
      const nullCount =
        question.type === "fill-in-sequence"
          ? question.sequence
            ? question.sequence.filter((item) => item === null).length
            : question.correctAnswers.length
          : question.question.reduce(
              (count, str) => count + (str.match(/null/g) || []).length,
              0
            );
      return Array(nullCount).fill("");
    } else if (question.type === "blank-answer") {
      return question.sequence.filter((n) => n === null).map(() => "");
    } else if (question.type === "picture-addition") {
      return "";
    } else if (question.type === "table-quiz") {
      return null;
    }
    return "";
  };

  const flattenExpressions = (expressions) =>
    expressions.flatMap((expr) =>
      expr.children ? [expr, ...flattenExpressions(expr.children)] : [expr]
    );

  const handleAnswerChange = (e, index) => {
    if (question.type === "fill-in-sequence") {
      const prevSequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[index] = e.target.value;
      setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
    } else {
      setUserAnswers({ ...userAnswers, [question._id]: e.target.value });
    }
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleSingleSelect = (value) => {
    setUserAnswers({ ...userAnswers, [question._id]: value });
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleMultiSelect = (value) => {
    const prev = userAnswers[question._id] || [];
    const updated = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    setUserAnswers({ ...userAnswers, [question._id]: updated });
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleSequenceInputChange = (index, value) => {
    const prevSequenceAnswers =
      userAnswers[question._id] || initializeUserAnswer(question);
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
    setFeedback({ ...feedback, [question._id]: "" });
    setFilledSequences([]);
  };

  const ansInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleSequenceOptionClick = (option) => {
    const prevSequenceAnswers =
      userAnswers[question._id] || initializeUserAnswer(question);
    const firstEmptyIndex = prevSequenceAnswers.findIndex((val) => !val);
    if (firstEmptyIndex !== -1) {
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[firstEmptyIndex] = option;
      setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
      setFeedback({ ...feedback, [question._id]: "" });
      setFilledSequences([]);
    }
  };

  const handleMathSubmit = (question) => {
    const currentAnswers = mathAnswers[question.id] || {};
    const inputs = flattenExpressions(question.pieces).filter(
      (expr) => expr.objectType === "QMInput"
    );

    const correctCount = inputs.filter(
      (input) => currentAnswers[input.id] === input.correctAnswer
    ).length;

    setMathScore({
      correct: correctCount,
      total: inputs.length,
      percentage: Math.round((correctCount / inputs.length) * 100) || 0,
    });
    setMathSubmitted(true);

    if (correctCount === inputs.length) {
      setFeedback({
        ...feedback,
        [question._id]: "✅ Correct! All answers correct!",
      });
      setCorrectAnswers((prev) => prev + 1);
      setAttemptedQuestions((prev) => prev + 1);

      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback({
            ...feedback,
            [questions[currentQuestionIndex + 1]?._id]: "",
          });
          setMathSubmitted(false);
          setMathAnswers({});
          setMathScore({ correct: 0, total: 0, percentage: 0 });
        }
      }, 1500);
    } else {
      setAttemptedQuestions((prev) => prev + 1);
    }
  };

  const handleMathReset = () => {
    setMathAnswers({});
    setMathSubmitted(false);
    setMathScore({ correct: 0, total: 0, percentage: 0 });
  };

  const handleTableQuizAnswer = (isCorrect, questionId, feedbackMessage) => {
    console.log("handleTableQuizAnswer:", {
      isCorrect,
      questionId,
      feedbackMessage,
    });
    setUserAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: isCorrect ? "correct" : "incorrect",
      };
      console.log("Updated userAnswers:", newAnswers);
      return newAnswers;
    });
    setFeedback((prev) => {
      const newFeedback = { ...prev, [questionId]: String(feedbackMessage) };
      console.log("Updated feedback:", newFeedback);
      return newFeedback;
    });

    setAttemptedQuestions((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback((prev) => ({
            ...prev,
            [questions[currentQuestionIndex + 1]?._id]: "",
          }));
        } else {
          setFeedback((prev) => ({
            ...prev,
            [questionId]: "✅ Correct! Quiz completed!",
          }));
        }
      }, 1500);
    }
  };

  useEffect(() => {
    setFilledSequences([]);
    setFeedback((prev) => ({ ...prev, [question?._id]: "" }));
    setMathSubmitted(false);
    setMathAnswers({});
    setAnswers({});
    setMathScore({ correct: 0, total: 0, percentage: 0 });
  }, [currentQuestionIndex, question?._id]);

  const checkAnswer = () => {
    let isCorrect = false;
    const userInput = userAnswers[question._id];

    if (question.type === "single-select" || question.type === "reasoning") {
      isCorrect = userInput === question.options[question.correctAnswerIndex];
    } else if (question.type === "multi-select") {
      const selected = (userInput || []).sort().join(",");
      const correct = question.correctAnswerIndices
        .map((i) => question.options[i])
        .sort()
        .join(",");
      isCorrect = selected === correct;
    } else if (question.type === "sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      isCorrect =
        sequenceAnswers.length === question.correctAnswers.length &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );

      if (isCorrect) {
        const nullCount = question.question.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );
        let nullIndex = 0;
        const replaced = question.question.map((str) =>
          str.replace(/null/g, () => sequenceAnswers[nullIndex++] || "")
        );
        setFilledSequences(replaced);
      }
    } else if (question.type === "fill-in-sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      isCorrect =
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );
    } else if (question.type === "blank-answer") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      const correctAnswers = question.correctAnswers;
      isCorrect =
        sequenceAnswers.length === correctAnswers.length &&
        sequenceAnswers.every(
          (value, idx) => value && parseInt(value, 10) === correctAnswers[idx]
        );
    } else if (question.type === "picture-addition") {
      isCorrect = parseInt(userInput) === question.number1 + question.number2;
    } else {
      const normalizedUser = String(userInput || "")
        .trim()
        .toLowerCase();
      if (question.correctAnswers) {
        isCorrect = question.correctAnswers.some(
          (correct) => normalizedUser === String(correct).trim().toLowerCase()
        );
      } else {
        const normalizedCorrect = String(question.correctAnswer)
          .trim()
          .toLowerCase();
        isCorrect = normalizedUser === normalizedCorrect;
      }
    }

    setAttemptedQuestions((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    const feedbackMessage = isCorrect
      ? "✅ Correct!"
      : question.type === "sequence" || question.type === "fill-in-sequence"
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${(userInput || []).join(", ")}`
      : question.type === "blank-answer"
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          " and "
        )}. You entered: ${(userInput || []).join(", ")}`
      : question.type === "picture-addition"
      ? `❌ Incorrect, the correct answer is ${
          question.number1 + question.number2
        }. You entered: ${userInput || ""}`
      : question.correctAnswers
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${userInput || ""}`
      : `❌ Incorrect, the correct answer is ${
          question.correctAnswer
        }. You entered: ${userInput || ""}`;

    setFeedback({
      ...feedback,
      [question._id]: feedbackMessage,
    });

    if (isCorrect) {
      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback({
            ...feedback,
            [questions[currentQuestionIndex + 1]?._id]: "",
          });
          setFilledSequences([]);
        } else {
          setFeedback({
            ...feedback,
            [question._id]: "✅ Correct! Quiz completed!",
          });
        }
      }, 1500);
    }
  };
  const transformPieces = (pieces) =>
    pieces
      .map((piece) => {
        if (piece.objectType === "PlainText") {
          return { renderAs: "text", text: piece.text };
        } else if (
          piece.objectType === "QMEquation" ||
          piece.objectType === "QMAlgebraic" ||
          piece.objectType === "QMExponent"
        ) {
          return { renderAs: "math", text: piece.latex };
        } else if (piece.objectType === "QMInput") {
          return {
            renderAs: "input",
            id: piece.id,
            correctAnswer: piece.correctAnswer,
          };
        }
        return null;
      })
      .filter(Boolean);

  // console.log("current question", question);

  const [userAnswer, setUserAnswer] = useState("");

  const handleOnSubmit = (isCorrect, answer, correctAnswer) => {
    console.log("Submitted:", { isCorrect, answer, correctAnswer });
  };

  const handleOnNext = () => {
    setAttemptedQuestions((prev) => prev + 1);
    setUserAnswer(""); // Reset answer
  };

  const renderQuestion = () => {
    switch (question?.type) {
      case "multiply":
        return <Multiplication lesson={question} />;

      case "addition":
        return <Addition lesson={question} />;

      case "subtraction":
        return <Subtraction lesson={question} />;

      case "SINGLE_SELECT":
        return (
          <SingleSelect
            data={{
              prompt: question.prompt,
              options: question.options || [],
              feedback: question.feedback || {
                correct: "Correct!",
                incorrect: "Incorrect, please try again.",
              },
            }}
            onNext={(isCorrect) => {
              setAttemptedQuestions((prev) => prev + 1);
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }
              const answer = isCorrect ? "correct" : "incorrect";
              setUserAnswers({ ...userAnswers, [question._id]: answer });
              setFeedback({
                ...feedback,
                [question._id]: isCorrect ? "✅ Correct!" : "❌ Incorrect!",
              });
              if (isCorrect) {
                setShowQuestion(false);
                setTimeout(() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setShowQuestion(true);
                  }
                }, 1500);
              }
            }}
          />
        );

      case "multi":
        return (
          <MultiSelect
            data={{
              prompt: question.prompt,
              options: question.options || [],
              feedback: question.feedback || {
                correct: "Correct!",
                incorrect: "Incorrect, please try again.",
              },
            }}
            onNext={(isCorrect) => {
              setAttemptedQuestions((prev) => prev + 1);
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }
              const answer = isCorrect ? "correct" : "incorrect";
              setUserAnswers({ ...userAnswers, [question._id]: answer });
              setFeedback({
                ...feedback,
                [question._id]: isCorrect ? "✅ Correct!" : "❌ Incorrect!",
              });
              if (isCorrect) {
                setShowQuestion(false);
                setTimeout(() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setShowQuestion(true);
                  }
                }, 1500);
              }
            }}
          />
        );
      case "EQUATION":
        return (
          // <SingleMathQuiz
          //   question={question}
          //   answers={mathAnswers}
          //   setAnswers={setMathAnswers}
          //   submitted={mathSubmitted}
          //   onSubmit={handleMathSubmit}
          //   onReset={handleMathReset}
          //   score={mathScore}
          // />

          <SingleMathQuiz
            question={question}
            answers={answers}
            setAnswers={setAnswers}
            submitted={submitted}
            onSubmit={onSubmit}
            onReset={onReset}
            score={score}
          />
        );
      case "TEST":
        return (
          <SingleMathQuizTest
            question={question}
            answers={mathAnswers}
            setAnswers={setMathAnswers}
            submitted={mathSubmitted}
            onSubmit={handleMathSubmit}
            onReset={handleMathReset}
            score={mathScore}
          />
        );

      case "num-sort":
        return (
          <NumSortingComponent
            question={question}
            onAnswer={(isCorrect) => {
              setAttemptedQuestions((prev) => prev + 1);
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }
              const feedbackMessage = isCorrect
                ? "✅ Correct! Well done!"
                : "❌ Incorrect. Try again!";
              setFeedback({ ...feedback, [question._id]: feedbackMessage });

              if (isCorrect) {
                setShowQuestion(false);
                setTimeout(() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setShowQuestion(true);
                    setFeedback({
                      ...feedback,
                      [questions[currentQuestionIndex + 1]?._id]: "",
                    });
                  } else {
                    setFeedback({
                      ...feedback,
                      [question._id]: "✅ Correct! Quiz completed!",
                    });
                  }
                }, 1500);
              }
            }}
            onReset={() => {
              setFeedback({ ...feedback, [question._id]: "" });
            }}
          />
        );

      case "english":
        return (
          <>
            <p onClick={() => readAloud(question.hint)} className="pointer">
              Hint
            </p>
            <EnglishWordSorting
              question={question}
              onAnswer={(isCorrect) => {
                setAttemptedQuestions((prev) => prev + 1);
                if (isCorrect) {
                  setCorrectAnswers((prev) => prev + 1);
                }
                const feedbackMessage = isCorrect
                  ? "✅ Correct!"
                  : `❌ Incorrect. ${question?.feedback?.incorrect}`;
                setFeedback({ ...feedback, [question._id]: feedbackMessage });

                if (!userAnswers[question._id]) {
                  setUserAnswers((prev) => ({
                    ...prev,
                    [question._id]: isCorrect ? "correct" : "incorrect",
                  }));
                }

                if (isCorrect) {
                  setShowQuestion(false);
                  setTimeout(() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setShowQuestion(true);
                      setFeedback({
                        ...feedback,
                        [questions[currentQuestionIndex + 1]?._id]: "",
                      });
                    } else {
                      setFeedback({
                        ...feedback,
                        [question._id]: "✅ Correct! Quiz completed!",
                      });
                    }
                  }, 1500);
                }
              }}
              onNext={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setShowQuestion(true);
                  setFeedback({
                    ...feedback,
                    [questions[currentQuestionIndex + 1]?._id]: "",
                  });
                }
              }}
              onReset={() => {
                setFeedback({ ...feedback, [question._id]: "" });
                setUserAnswers((prev) => ({
                  ...prev,
                  [question._id]: "",
                }));
              }}
            />
          </>
        );

      case "reasoning":
      case "single-select":
        return (
          <>
            {question?.sequenceType === "html" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.prompt),
                }}
                className="mb-4"
              />
            ) : (
              <p className="mb-4 text-lg">{question.prompt}</p>
            )}

            {question.imageUrl?.length > 0 && (
              <div className="mb-4">
                {question.imageUrl.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`img-${idx}`}
                    style={
                      question.style || { maxWidth: "100%", height: "auto" }
                    }
                  />
                ))}
              </div>
            )}
            {question.options.map((opt, index) => {
              const isSelected = userAnswers[question._id] === opt;
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question._id}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleSingleSelect(opt)}
                      className="sr-only"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-600 text-gray-600"
                      } mr-2`}
                      aria-hidden="true"
                    >
                      {alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "number-line":
        return (
          <NumberLineQuestion
            question={question}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            feedback={feedback[question._id] || ""}
            setFeedback={(message) =>
              setFeedback({ ...feedback, [question._id]: message })
            }
            initializeUserAnswer={initializeUserAnswer}
          />
        );

      case "multi-select":
        return (
          <>
            <p className="mb-4 text-lg">{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = (userAnswers[question._id] || []).includes(
                opt
              );
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiSelect(opt)}
                      className="sr-only"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-600 text-gray-600"
                      } mr-2`}
                      aria-hidden="true"
                    >
                      {isSelected ? "✔" : alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "fill-in":
        return (
          <div className="mb-6 flex flex-col items-start">
            {question?.sequenceType === "html" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.prompt),
                }}
                className="mb-4"
              />
            ) : (
              <p className="mb-4 text-lg">{question.prompt}</p>
            )}
            {question.imageUrl?.length > 0 && (
              <div className="flex flex-wrap justify-start gap-4 mb-6">
                {question.imageUrl.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded"
                    style={{
                      border: "1px solid #22c55e", // green-500 border
                      display: "inline-flex",
                      padding: "2px",
                      background: "#f0fdf4", // light green bg
                    }}
                  >
                    <img
                      src={img}
                      alt={`Question ${currentQuestionIndex + 1} image ${
                        index + 1
                      }`}
                      style={{
                        maxWidth: "130px", // increased maxWidth for big screens
                        height: "auto",
                        display: "block",
                        border: "none",
                      }}
                      className="quiz-img"
                    />
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              value={userAnswers[question._id] || ""}
              onChange={(e) => handleAnswerChange(e)}
              placeholder="Your answer"
              className="p-2 border border-gray-300 rounded w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <style jsx>{`
              .quiz-img {
                max-width: 320px;
                height: auto;
              }
              @media (max-width: 1024px) {
                .quiz-img {
                  max-width: 220px;
                }
              }
              @media (max-width: 640px) {
                .quiz-img {
                  max-width: 120px;
                  height: auto;
                }
              }
            `}</style>
          </div>
        );

      case "fill-in-sequence":
        return (
          <>
            <p className="mb-4 text-lg">{question.prompt}</p>
            {question?.sequenceType === "html" ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.sequence[0]),
                  }}
                  className="mb-4"
                />
                <div className="flex gap-2 mb-4">
                  {Array(question.correctAnswers.length)
                    .fill()
                    .map((_, index) => (
                      <input
                        key={index}
                        ref={ansInput}
                        autoFocus={index === 0}
                        onFocus={(e) => e.target.select()}
                        type="number"
                        value={(userAnswers[question._id] || [])[index] || ""}
                        onChange={(e) => handleAnswerChange(e, index)}
                        className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=""
                        aria-label={`Answer ${index + 1} for ${
                          question.prompt
                        }`}
                      />
                    ))}
                </div>
              </>
            ) : (
              <div className="flex items-center flex-wrap gap-2">
                {question?.sequence?.map((item, index) => {
                  if (item === null) {
                    const nullIndex = question.sequence
                      .slice(0, index)
                      .filter((i) => i === null).length;
                    return (
                      <input
                        key={index}
                        type="number"
                        ref={ansInput}
                        autoFocus={index === 0}
                        onFocus={(e) => e.target.select()}
                        value={
                          (userAnswers[question._id] || [])[nullIndex] || ""
                        }
                        onChange={(e) => handleAnswerChange(e, nullIndex)}
                        className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=""
                        aria-label={`Answer ${nullIndex + 1} for ${
                          question.prompt
                        }`}
                      />
                    );
                  }
                  return (
                    <span key={index} className="mr-1">
                      {item}
                      {index < question.sequence.length - 1 ? "," : ""}
                    </span>
                  );
                })}
              </div>
            )}
            {question?.options?.length > 0 && (
              <div className="flex justify-start gap-2 mt-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSequenceOptionClick(option)}
                    className={`bg-blue-100 text-gray-800 px-4 py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-200 transition ${
                      (userAnswers[question._id] || []).includes(option)
                        ? "bg-blue-300"
                        : ""
                    }`}
                    aria-label={`Select option ${option}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </>
        );

      case "sequence":
        const sequenceAnswers =
          userAnswers[question._id] || initializeUserAnswer(question);
        const questionStrings = Array.isArray(question.question)
          ? question.question
          : question.question[0]?.split(",") || [];
        const totalNullCount = questionStrings.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );

        return (
          <>
            <div className="mb-6">
              <p className="text-xl font-semibold">{question.text}</p>
              {question.clue && (
                <p className="text-lg italic text-gray-600">
                  Clue: {question.clue}
                </p>
              )}
            </div>
            {question.imageUrl?.length > 0 && (
              <div className="flex flex-wrap justify-start gap-4 mb-6">
                {question.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                    style={
                      question.style || { maxWidth: "100%", height: "auto" }
                    }
                  />
                ))}
              </div>
            )}
            <div className="text-lg mb-6">
              {questionStrings.map((sequenceStr, qIndex) => {
                if (!sequenceStr || typeof sequenceStr !== "string") {
                  return (
                    <p key={qIndex} className="text-red-600">
                      Invalid question format
                    </p>
                  );
                }
                const isSentence = /[a-zA-Z]/.test(sequenceStr);
                const nullOffset = questionStrings
                  .slice(0, qIndex)
                  .reduce(
                    (count, str) => count + (str.match(/null/g) || []).length,
                    0
                  );

                return (
                  <div key={qIndex} className="mb-4">
                    {isSentence ? (
                      <p className="text-lg">
                        {sequenceStr.split(" ").map((word, idx) => {
                          if (word === "null") {
                            const nullIndex =
                              nullOffset +
                              sequenceStr
                                .split(" ")
                                .slice(0, idx)
                                .filter((w) => w === "null").length;
                            return (
                              <input
                                key={idx}
                                type="text"
                                ref={ansInput}
                                onFocus={(e) => e.target.select()}
                                value={sequenceAnswers[nullIndex] || ""}
                                onChange={(e) =>
                                  handleSequenceInputChange(
                                    nullIndex,
                                    e.target.value
                                  )
                                }
                                className="w-14 h-8 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 mx-1"
                                placeholder=""
                                aria-label={`Answer ${nullIndex + 1} for ${
                                  question.text
                                }`}
                              />
                            );
                          }
                          return <span key={idx}> {word} </span>;
                        })}
                      </p>
                    ) : (
                      <div className="flex justify-center gap-2 flex-wrap items-center text-lg">
                        {sequenceStr.split(",").map((item, index) => {
                          const trimmed = String(item || "").trim();
                          if (trimmed === "null") {
                            const nullIndex =
                              nullOffset +
                              sequenceStr
                                .split(",")
                                .slice(0, index)
                                .filter((i) => i.trim() === "null").length;
                            return (
                              <span key={index} className="mx-1">
                                <input
                                  type="text"
                                  ref={ansInput}
                                  autoFocus={index === 0}
                                  onFocus={(e) => e.target.select()}
                                  value={sequenceAnswers[nullIndex] || ""}
                                  onChange={(e) =>
                                    handleSequenceInputChange(
                                      nullIndex,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder={`Answer ${nullIndex + 1}`}
                                  aria-label={`Answer ${nullIndex + 1} for ${
                                    question.text
                                  }`}
                                />
                                {index < sequenceStr.split(",").length - 1 &&
                                  ","}
                              </span>
                            );
                          }
                          return (
                            <span key={index} className="mx-1">
                              {trimmed}
                              {index < sequenceStr.split(",").length - 1 && ","}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {question.options.length > 0 && (
                <div className="flex justify-start gap-2 mb-6">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSequenceOptionClick(option)}
                      className={`bg-blue-100 text-gray-800 px-4 py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-200 transition ${
                        sequenceAnswers.includes(option) ? "bg-blue-300" : ""
                      }`}
                      aria-label={`Select option ${option}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filledSequences.length > 0 && (
              <div className="mt-4 text-lg">
                {filledSequences.map((seq, idx) => (
                  <p key={idx}>
                    Output {idx + 1}:{" "}
                    <span className="font-mono text-blue-700">{seq}</span>
                  </p>
                ))}
              </div>
            )}
          </>
        );

      case "picture-addition":
        return (
          <PictureAdditionQuiz
            lesson={question}
            userAnswer={userAnswers[question._id] || ""}
            onNext={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            }}
            setUserAnswer={(val) => {
              setUserAnswers({ ...userAnswers, [question._id]: val });
              setFeedback({ ...feedback, [question._id]: "" });
            }}
            onSubmit={(isCorrect, userInputSummary) => {
              setAttemptedQuestions((prev) => prev + 1);
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }
              const feedbackMessage = isCorrect
                ? "✅ Correct!"
                : `❌ Incorrect, the correct answer is ${
                    question.correctAnswer
                  }. You entered: ${userInputSummary.join(", ")}`;
              setFeedback({ ...feedback, [question._id]: feedbackMessage });

              if (isCorrect) {
                setShowQuestion(false);
                setTimeout(() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setShowQuestion(true);
                    setFeedback({
                      ...feedback,
                      [questions[currentQuestionIndex + 1]?._id]: "",
                    });
                  } else {
                    setFeedback({
                      ...feedback,
                      [question._id]: "✅ Correct! Quiz completed!",
                    });
                  }
                }, 1500);
              }
            }}
          />
        );
      case "mcq":
        return (
          <PictureMCQ
            lesson={question}
            userAnswer={userAnswers[question._id] || ""}
            onNext={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setShowSolution(false);
              }
            }}
            setUserAnswer={(val) => {
              setUserAnswers({ ...userAnswers, [question._id]: val });
              setFeedback({ ...feedback, [question._id]: "" });
            }}
            onSubmit={(isCorrect, userAnswer, correctAnswer) => {
              setAttemptedQuestions((prev) => prev + 1);
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }
              const feedbackMessage = isCorrect
                ? "✅ Correct!"
                : `❌ Incorrect, the correct answer is ${correctAnswer}. You entered: ${userAnswer}`;
              setFeedback({ ...feedback, [question._id]: feedbackMessage });

              if (isCorrect) {
                setShowQuestion(false);
                setTimeout(() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setShowQuestion(true);
                    setFeedback({
                      ...feedback,
                      [questions[currentQuestionIndex + 1]?._id]: "",
                    });
                  } else {
                    if (!isCorrect) {
                      <SolutionBox solutionKey={question.solutionKey} />;
                    }
                    setFeedback({
                      ...feedback,
                      [question._id]: "✅ Correct! Quiz completed!",
                    });
                  }
                }, 1500);
              }
            }}
          />
        );
      case "eq-mcq":
        return (
          <EquationMCQ
            lesson={question}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            showSolution={showSolution}
            onSubmit={handleOnSubmit}
            onNext={goToNextQuestion}
          />
        );

      case "table-quiz":
        if (
          !question.tableData ||
          !Array.isArray(question.tableData) ||
          question.tableData.length === 0
        ) {
          return <p className="text-lg text-red-600">Invalid table data.</p>;
        }
        const tableHeaders = Object.keys(question.tableData[0]);
        const tableInputAnswers = userAnswers[question._id] || {};
        const nullCells = [];
        question.tableData.forEach((row, rowIndex) => {
          tableHeaders.forEach((key, colIndex) => {
            if (row[key] === null) {
              nullCells.push({ rowIndex, colIndex, key });
            }
          });
        });

        const allNullsFilled = nullCells.every(
          ({ rowIndex, colIndex }) =>
            tableInputAnswers[`${rowIndex}-${colIndex}`] !== undefined &&
            tableInputAnswers[`${rowIndex}-${colIndex}`] !== ""
        );

        const handleTableSubmit = () => {
          let isCorrect = true;
          let userInputSummary = [];
          nullCells.forEach(({ rowIndex, colIndex, key }) => {
            const userVal = tableInputAnswers[`${rowIndex}-${colIndex}`];
            const correctVal = question.correctAnswer;
            userInputSummary.push(userVal);
            if (
              correctVal === undefined ||
              String(userVal).trim() !== String(correctVal).trim()
            ) {
              isCorrect = false;
            }
          });

          setAttemptedQuestions((prev) => prev + 1);
          if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
          }

          const feedbackMessage = isCorrect
            ? "✅ Correct!"
            : `❌ Incorrect, the correct answer is ${
                question.correctAnswer
              }. You entered: ${userInputSummary.join(", ")}`;

          setFeedback({ ...feedback, [question._id]: feedbackMessage });

          if (isCorrect) {
            setShowQuestion(false);
            setTimeout(() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setShowQuestion(true);
                setFeedback({
                  ...feedback,
                  [questions[currentQuestionIndex + 1]?._id]: "",
                });
              } else {
                setFeedback({
                  ...feedback,
                  [question._id]: "✅ Correct! Quiz completed!",
                });
              }
            }, 1500);
          }
        };

        return (
          <div className="question-container">
            <style>
              {`
          .quiz-table {
            font-size: 0.85rem;
            width: auto;
            min-width: unset;
            max-width: 450px;
            margin: 0 auto;
            border-collapse: collapse;
            justify-content: left;
            display: table;
          }
          .quiz-table th,
          .quiz-table td {
            padding: 0.25rem 0.5rem;
            border: 1px solid #d1d5db;
            text-align: center;
            min-width: auto;
            max-width: auto;
            height: 32px;
          }
          .quiz-table th {
            background:rgb(144, 150, 144);
            font-weight: 600;
          }
          .quiz-table input[type="text"] {
            width: 40px;
            height: 24px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            text-align: left;
            font-size: Ascendancy
            .quiz-table input[type="text"] {
              width: 40px;
              height: 24px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              text-align: left;
              font-size: 0.85rem;
              padding: 0 0.25rem;
            }
          `}
            </style>
            <div className="text-section mb-4">
              <h2 className="text-base font-semibold">{question.title}</h2>
              <h3 className="text-sm">{question.question}</h3>
            </div>
            <table className="quiz-table mb-4">
              <thead>
                <tr>
                  {tableHeaders.map((key, index) => (
                    <th key={index}>{`Number of ${key}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((key, colIndex) => (
                      <td key={colIndex}>
                        {row[key] === null ? (
                          <input
                            type="text"
                            value={
                              tableInputAnswers[`${rowIndex}-${colIndex}`] || ""
                            }
                            onChange={(e) => {
                              setUserAnswers((prev) => ({
                                ...prev,
                                [question._id]: {
                                  ...(prev[question._id] || {}),
                                  [`${rowIndex}-${colIndex}`]: e.target.value,
                                },
                              }));
                              setFeedback({ ...feedback, [question._id]: "" });
                            }}
                            aria-label={`Input for row ${
                              rowIndex + 1
                            }, column ${key}`}
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleTableSubmit}
                disabled={!allNullsFilled}
                className={`
          px-4 py-1 rounded text-white font-semibold text-sm transition
          ${
            allNullsFilled
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }
        `}
                aria-label="Submit answer"
                type="button"
              >
                Submit
              </button>
              <button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-4 py-1 rounded text-white font-semibold text-sm transition ${
                  currentQuestionIndex === questions.length - 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                aria-label="Next question"
              >
                Next
              </button>
            </div>
          </div>
        );

      default:
        return <p className="text-lg">Unsupported question type.</p>;
    }
  };

  const allInputsFilled = () => {
    if (question?.type === "math-quiz") {
      return false;
    } else if (question?.type === "sequence") {
      const sequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      return sequenceAnswers.every((val) => val && val.trim() !== "");
    } else if (question?.type === "fill-in-sequence") {
      const sequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      return (
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every((val) => val && val.trim() !== "")
      );
    } else if (question?.type === "blank-answer") {
      const sequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      return sequenceAnswers.every((val) => val && val.trim() !== "");
    } else if (question?.type === "picture-addition") {
      return (
        userAnswers[question._id] !== undefined &&
        userAnswers[question._id] !== ""
      );
    } else if (question?.type === "table-quiz") {
      return (
        userAnswers[question._id] !== undefined &&
        userAnswers[question._id] !== null &&
        typeof userAnswers[question._id] !== "object" &&
        userAnswers[question._id] !== ""
      );
    }
    return (
      userAnswers[question?._id] !== undefined &&
      userAnswers[question?._id] !== "" &&
      typeof userAnswers[question._id] !== "object"
    );
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowQuestion(true);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowQuestion(true);
      setUserAnswer(null)
      
    }
  };

  // Calculate Smart Score as a percentage
  const smartScore =
    attemptedQuestions > 0
      ? Math.round((correctAnswers / attemptedQuestions) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={loadingImage}
          alt="Loading"
          className="w-24 h-24 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 font-sans max-w-3xl mx-auto">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        .custom-radio:hover,
        .custom-checkbox:hover {
          border-color: #4caf50;
        }
        input:focus {
          outline: 2px solid #4caf50;
          outline-offset: 2px;
        }
        .quiz-sidebar {
          border: 1px solid #d1d5db;
          border-radius: 5px;
          padding: 10px;
          min-width: 120px;
          max-width: 220px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .quiz-sidebar h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2563eb;
        }
        .quiz-sidebar .progress-row {
          display: flex;
          flex-direction: row;
          gap: 0.8rem;
          flex-wrap: wrap;
        }
        .quiz-sidebar .sidebar-label {
          color: #374151;
          font-size: 0.95rem;
          margin-bottom: 0.15rem;
          justify-content: center;
          align-items: center;
        }
        .quiz-sidebar .sidebar-value {
          color: #059669;
          font-size: 1.1rem;
          justify-content: center;
          align-items: center;
          margin-left: 10px;
          margin-bottom: 0.15rem;
          right: 0;
        }
        .quiz-container {
          display: grid;
          grid-template-columns: 80% 10%;
          gap: 1rem;
          align-items: start;
        }
        @media (max-width: 640px) {
          .quiz-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .quiz-sidebar {
            order: -1;
            max-width: 100%;
          }
          .quiz-sidebar h4 {
            font-size: 0.85rem;
          }
          .quiz-sidebar .sidebar-label {
            font-size: 0.6rem;
          }
          .quiz-sidebar .sidebar-value {
            font-size: 0.9rem;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
      <p style={{ fontSize: "10px", marginBottom: "8px" }}>
        {lessonName} - {question?.type}{" "}
      </p>
      <div className="quiz-container">
        <div className="justify-left items-left">
          {showQuestion ? renderQuestion() : null}

          <div>
            {showQuestion &&
              ![
                "english",
                "num-sort",
                // "TEST",
                "SINGLE_SELECT",
                "picture-addition",
                "mcq",
                "eq-mcq",
                "table-quiz",
                "EQUATION",
                "subtraction",
                "multi",
                "addition",
                "multiply",
              ].includes(question?.type) && (
                <div className="flex gap-10 mt-6">
                  <button
                    onClick={checkAnswer}
                    disabled={!allInputsFilled()}
                    className={`
                          mt-4 px-6 py-2 rounded text-white font-semibold transition
                          ${
                            allInputsFilled()
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-400 cursor-not-allowed"
                          }
                        `}
                    aria-label="Submit answer"
                    type="button"
                  >
                    Submit
                  </button>

                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`mt-4 px-6 py-2 rounded text-white font-semibold transition ${
                      currentQuestionIndex === questions.length - 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    aria-label="Next question"
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
          <div className="mt-6 text-lg text-gray-700 font-semibold justify-center items-center">
            {feedback[question?._id] &&
              typeof feedback[question._id] === "string" && (
                <p
                  className={`mt-4 text-lg justify-center ${
                    feedback[question._id].startsWith("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback[question._id]}
                </p>
              )}
          </div>
        </div>
        {!["addition", "multiply", "subtraction"].includes(question?.type) && (
          <div className="quiz-sidebar">
            <div className="progress-row">
              <div>
                <div className="sidebar-label">Questions</div>
                <div className="sidebar-value">
                  {currentQuestionIndex + 1}/{questions.length}
                </div>
              </div>
              <div>
                <div className="sidebar-label">Time Elapsed</div>
                <div className="sidebar-value">{formatTime(elapsedTime)}</div>
              </div>
              <div>
                <div className="sidebar-label">Smart Score</div>
                <div className="sidebar-value">{smartScore}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
