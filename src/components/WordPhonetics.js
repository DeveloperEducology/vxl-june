import { useState, useEffect } from "react";

const WordPhonetics = () => {
  const [word, setWord] = useState("");
  const [phoneticBreakdown, setPhoneticBreakdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Enhanced phoneme mapping with context rules
  const phonemeMap = {
    a: { default: "æ", beforeR: "ɑː", inFinalE: "eɪ" },
    b: "b",
    c: { default: "k", beforeEI: "s" },
    d: "d",
    e: { default: "ɛ", inFinalE: "" },
    f: "f",
    g: { default: "ɡ", beforeEI: "dʒ" },
    h: "h",
    i: { default: "ɪ", inFinalE: "aɪ" },
    j: "dʒ",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    o: { default: "ɔ", inFinalE: "oʊ" },
    p: "p",
    q: "kw",
    r: "r",
    s: "s",
    t: "t",
    u: { default: "ʌ", inFinalE: "uː" },
    v: "v",
    w: "w",
    x: "ks",
    y: { default: "j", asVowel: "ɪ" },
    z: "z",
    th: "θ",
    sh: "ʃ",
    ch: "tʃ",
  };

  // Fallback function to generate phonetic breakdown
  const getPhoneticBreakdown = (text) => {
    if (!text) return "";
    const chars = text.toLowerCase().split("");
    const phonemes = [];
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextChar = chars[i + 1] || "";
      
      // Handle common digraphs
      if (char === "t" && nextChar === "h") {
        phonemes.push(phonemeMap.th);
        i++;
      } else if (char === "s" && nextChar === "h") {
        phonemes.push(phonemeMap.sh);
        i++;
      } else if (char === "c" && nextChar === "h") {
        phonemes.push(phonemeMap.ch);
        i++;
      } else {
        const map = phonemeMap[char] || {};
        let phoneme = map.default || char;
        
        // Context rules
        if (char === "c" && /[ei]/.test(nextChar)) phoneme = map.beforeEI || phoneme;
        if (char === "g" && /[ei]/.test(nextChar)) phoneme = map.beforeEI || phoneme;
        if (char === "a" && nextChar === "r") phoneme = map.beforeR || phoneme;
        if (/[aeiou]/.test(char) && nextChar === "e" && i === chars.length - 2) {
          phoneme = map.inFinalE || phoneme;
        }
        if (char === "y" && /[aeiou]/.test(nextChar)) phoneme = map.asVowel || phoneme;
        
        if (phoneme) phonemes.push(phoneme);
      }
    }
    
    return phonemes.join(" - ");
  };

  // Fetch phonetics from Dictionary API
  const fetchPhonetics = async (word) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      if (data.title === "No Definitions Found") {
        throw new Error("Word not found in dictionary.");
      }
      const phonetic = data[0]?.phonetic || getPhoneticBreakdown(word);
      setPhoneticBreakdown(phonetic);
      setIsLoading(false);
      return phonetic;
    } catch (error) {
      console.error("Error fetching phonetics:", error);
      setError("Could not fetch phonetics. Using fallback breakdown.");
      const fallback = getPhoneticBreakdown(word);
      setPhoneticBreakdown(fallback);
      setIsLoading(false);
      return fallback;
    }
  };

  // Handle speech synthesis: speak phonetics then full word
  const handleSpeak = async () => {
    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      setError("Please enter a valid word (letters only).");
      return;
    }

    // Fetch phonetics for display
    const phonetic = await fetchPhonetics(word);
    const phonemes = phonetic.split(" - ").filter(p => p);

    // Speak each phoneme individually
    for (const phoneme of phonemes) {
      const utterance = new SpeechSynthesisUtterance(phoneme.replace(/[ˈˌ]/g, "")); // Remove stress markers
      utterance.lang = "en-US";
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang === "en-US" || v.lang === "en-IN") || voices[0];
      if (voice) utterance.voice = voice;
      speechSynthesis.speak(utterance);
      // Add a small delay to ensure phonemes are spoken distinctly
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Speak the full word
    const wordUtterance = new SpeechSynthesisUtterance(word);
    wordUtterance.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === "en-US" || v.lang === "en-IN") || voices[0];
    if (voice) wordUtterance.voice = voice;
    speechSynthesis.speak(wordUtterance);
  };

  // Load voices on component mount
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Word Phonetics Mode
        </h1>

        <p className="text-gray-600 mb-4">
          Type a word to hear its phonetic breakdown letter by letter, followed by the full word
        </p>

        <input
          type="text"
          placeholder="Type a word (e.g., apple)"
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          onClick={handleSpeak}
          disabled={isLoading}
          className={`px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : "🔊 Speak Phonetics & Word"}
        </button>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        {phoneticBreakdown && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Phonetic Breakdown:
            </h2>
            <p className="mt-2 text-xl text-blue-700 font-medium">
              {phoneticBreakdown}
            </p>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4 mt-6 text-sm text-gray-500">
          Example: <strong>APPLE</strong> → <em>/ˈæp.əl/</em> (spoken as "æ... p... p... l... apple")
        </div>
      </div>
    </div>
  );
};

export default WordPhonetics;