import React, { useEffect, useState } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Puter.js script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSpeak = async () => {
    if (!text.trim()) return;

    if (!window.puter || !window.puter.ai || !window.puter.ai.txt2speech) {
      alert("Puter.js not loaded yet.");
      return;
    }

    setLoading(true);
    try {
      const audio = await window.puter.ai.txt2speech(text, "en-US");
      audio.play();
    } catch (error) {
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
      />

      <button onClick={handleSpeak} disabled={loading} style={styles.button}>
        {loading ? "Speaking..." : "Speak"}
      </button>
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
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default TextToSpeech;
