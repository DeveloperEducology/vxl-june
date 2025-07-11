import { useState } from "react";

const PrefixQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [builtWord, setBuiltWord] = useState("");

  const lessonData = {
    lessonId: "vocab_kids_001",
    title: "Fun Vocabulary Learning",
    questions: [
      {
        type: "build_word",
        parts: ["un", "kind"],
        task: "Build a word that means 'not kind'",
        correctWord: "unkind",
        phonetic: "/ʌnˈkaɪnd/",
        isCorrect: true,
      },
      {
        type: "build_word",
        parts: ["re", "play"],
        task: "Build a word that means 'play again'",
        correctWord: "replay",
        phonetic: "/ˌriːˈpleɪ/",
        isCorrect: true,
      },
      {
        type: "prefix_quiz",
        word: "impossible",
        question: "What does the prefix 'im-' mean?",
        phonetic: "/ɪmˈpɒsəbl/",
        prefix: "im",
        options: [
          { text: "Not or opposite of", isCorrect: true },
          { text: "Very strong", isCorrect: false },
        ],
      },
      {
        type: "prefix_quiz",
        word: "preview",
        question: "What does the prefix 'pre-' mean?",
        phonetic: "/ˈpriːvjuː/",
        prefix: "pre",
        options: [
          { text: "Before", isCorrect: true },
          { text: "After", isCorrect: false },
        ],
      },
      {
        type: "emoji_match",
        word: "excited",
        question: "Which emoji shows 'excited'?",
        options: [
          { emoji: "😢", isCorrect: false },
          { emoji: "😄", isCorrect: true },
        ],
      },
    ],
  };

  const currentQuestion = lessonData.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < lessonData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
      setBuiltWord("");
    }
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";

      // Pick a voice from available voices
      const voices = synth.getVoices();
      console.log(voices);
      let selectedVoice = voices.find(
        (v) =>
          (v.lang === "id-ID" && v.name === "Damayanti") ||
          v.name.toLowerCase().includes("india")
      );
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0]; // fallback to first available voice
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      synth.cancel(); // Stop any ongoing speech
      synth.speak(utterance);
    }
  };

  const handleSelect = (value) => {
    readAloud(value);
    setBuiltWord((prev) => prev + value);
  };

  const handleAnswerClick = (isCorrect) => {
    setFeedback(isCorrect ? "Correct!" : "Try again!");
    if (isCorrect && currentQuestion.phonetic) {
      readAloud(currentQuestion.phonetic);
    }
  };

  const handleBuildWordClick = () => {
    const correct = builtWord === currentQuestion.correctWord;
    setFeedback(correct ? "Correct!" : "Try again!");
    if (correct && currentQuestion.phonetic) {
      readAloud(currentQuestion.phonetic);
    }
  };

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "build_word":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Build a Word</h3>
            <p className="mb-4">{currentQuestion.task}</p>
            <div className="flex space-x-2 mb-4">
              {currentQuestion.parts.map((part, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(part)}
                  className="bg-blue-200 px-4 py-2 rounded"
                >
                  {part}
                </button>
              ))}
            </div>
            <div className="mb-2 text-xl font-semibold">
              Built Word: <span className="text-green-600">{builtWord}</span>
            </div>
            {currentQuestion.phonetic && (
              <p className="italic text-gray-500">
                Phonetic: {currentQuestion.phonetic}
              </p>
            )}
            <button
              onClick={handleBuildWordClick}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check Answer
            </button>
          </div>
        );

      case "prefix_quiz":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Prefix Quiz</h3>
            <p className="mb-4">{currentQuestion.question}</p>
            {currentQuestion.phonetic && (
              <p className="italic text-gray-500 mb-2">
                Phonetic: {currentQuestion.phonetic}
              </p>
            )}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option.isCorrect)}
                  className="w-full border rounded p-3 text-left hover:bg-green-100"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        );

      case "emoji_match":
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Emoji Match</h3>
            <p className="mb-4">{currentQuestion.question}</p>
            <div className="flex space-x-4 justify-center">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option.isCorrect)}
                  className="text-3xl border rounded-full w-16 h-16 flex items-center justify-center hover:bg-green-100"
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          {lessonData.title}
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <span>
            Question {currentQuestionIndex + 1} of {lessonData.questions.length}
          </span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / lessonData.questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {renderQuestionComponent()}

        {feedback && (
          <div
            className={`mt-4 p-3 rounded text-white text-center ${
              feedback.includes("Correct") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded font-semibold ${
              feedback
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefixQuiz;
