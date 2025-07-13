import { useState, useRef, useEffect } from "react";
import { get as levenshteinDistance } from "fast-levenshtein";
import { FiVolume2 } from "react-icons/fi";

export default function PhoneticQuiz() {
  //   const words = [
  //     "fun", "sun", "run", "bun", "pun", "gun",
  //     "none", "done", "ton", "won", "shun", "stun",
  //     "spun", "one", "hun",
  //   ];

  // const words = ["spine", "fine", "line", "mine", "dine", "shine", "twine", "pine", "sign", "nine", "wine", "kind"];
  const words = [
    "This is my pen",
    "I am a student",
    "The sun is shining",
    "I love to run",
    "She is my friend",
    "We are going to the park",
    "He is a good",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef(null);

  const currentWord = words[currentIndex];

  const calculateSimilarity = (a, b) => {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 100;
    const distance = levenshteinDistance(a, b);
    return (1 - distance / maxLen) * 100;
  };

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported. Try Chrome.");
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US"; // Indian English

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0];
        const spoken = result.transcript.trim().toLowerCase();
        const score = result.confidence;

        setTranscript(spoken);
        setConfidence(score);

        const similarity = calculateSimilarity(
          spoken,
          currentWord.toLowerCase()
        );

        if (similarity >= 80) {
          setFeedback(`✅ Close enough! (${similarity.toFixed(0)}% match)`);
        } else {
          setFeedback(
            `❌ You said "${spoken}" (${similarity.toFixed(
              0
            )}% match). Try again.`
          );
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === "not-allowed") {
          setPermissionDenied(true);
          setError(null);
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      setError("Microphone permission error.");
      setPermissionDenied(true);
    }
  }, [currentWord]);

  const startListening = () => {
    setTranscript("");
    setFeedback("");
    setConfidence(0);
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const nextWord = () => {
    setTranscript("");
    setFeedback("");
    setConfidence(0);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const readAloud = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find((v) => v.lang === "en-US");

    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    speechSynthesis.cancel(); // stop any ongoing speech
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Phonetic Quiz
        </h1>
        <p className="text-center text-gray-700">Say the word aloud:</p>

        <div className="text-center text-3xl font-semibold text-blue-700 flex items-center justify-center gap-2">
          {currentWord}
          <button
            onClick={readAloud}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            title="Listen"
          >
            <FiVolume2 size={28} />
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">{transcript}</p>
        </div>

        {transcript && (
          <div className="text-center">
            <p className="text-lg text-gray-800">
              You said: <strong>{transcript}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Confidence: {Math.round(confidence * 100)}%
            </p>
            <p className="mt-2 text-lg">{feedback}</p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-md text-white ${
              isListening ? "bg-red-500" : "bg-blue-600"
            } hover:opacity-90`}
          >
            {isListening ? "Stop" : "Speak"}
          </button>
          <button
            onClick={nextWord}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:opacity-90"
          >
            Next Word
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {permissionDenied && (
          <p className="text-yellow-500 text-center">
            Please allow microphone access and refresh the page.
          </p>
        )}
      </div>
    </div>
  );
}
