import React, { useEffect, useState } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPuterReady, setIsPuterReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;

    script.onload = () => {
      if (window.puter?.ai?.txt2speech) {
        setIsPuterReady(true);
        console.log("✅ Puter.js loaded and ready.");
      } else {
        console.warn("⚠️ Puter.js loaded but API not available.");
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load Puter.js");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSpeak = async () => {
    if (!text.trim()) return;

    if (!window.puter?.ai?.txt2speech) {
      alert("Puter TTS not available yet. Try again later.");
      return;
    }

    setLoading(true);
    try {
      const audio = await window.puter.ai.txt2speech(text, "en-US");

      if (audio) {
        audio.play();
      } else {
        alert("No audio returned from TTS.");
      }
    } catch (error) {
      console.error("TTS error:", error);
      alert("TTS failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🗣️ Free Text to Speech (Puter.js)</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Enter text here..."
        style={styles.textarea}
        disabled={!isPuterReady}
      />

      <button
        onClick={handleSpeak}
        disabled={!isPuterReady || loading}
        style={{
          ...styles.button,
          backgroundColor: isPuterReady ? "#007bff" : "#aaa",
          cursor: isPuterReady ? "pointer" : "not-allowed",
        }}
      >
        {loading ? "🔊 Speaking..." : "▶️ Speak"}
      </button>

      {!isPuterReady && (
        <p style={styles.notice}>Loading Puter TTS library...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    color: "#fff",
    border: "none",
    transition: "0.3s all ease-in-out",
  },
  notice: {
    marginTop: "15px",
    color: "#555",
    fontStyle: "italic",
  },
};

export default TextToSpeech;
