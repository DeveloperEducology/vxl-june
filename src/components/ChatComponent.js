import React, { useEffect, useState } from "react";

const ChatComponent = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Load puter.js script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => console.log("Puter.js loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (!window.puter?.ai?.chat) {
      alert("❌ Puter.js not ready yet.");
      return;
    }

    setLoading(true);
    window.puter.ai.chat(query, (result) => {
      setResponse(result);
      setLoading(false);
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🧠 Chat with GPT-4.1 nano (via Puter.js)</h1>

      <div style={styles.inputBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      <div style={styles.responseBox}>
        <h3 style={styles.subHeading}>💬 Response:</h3>
        <p style={styles.responseText}>{response || "No response yet..."}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#f8f9ff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#4a4a8b",
    textAlign: "center",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  responseBox: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  subHeading: {
    marginBottom: "8px",
    color: "#333",
  },
  responseText: {
    fontSize: "16px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    color: "#222",
  },
};

export default ChatComponent;
