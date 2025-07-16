import React, { useState } from "react";

export default function FormObj() {
  const [rawJson, setRawJson] = useState(`{
  "lessonId": "68412667a6cecd8324899ed2",
  "text": ["Which comparison fits best?", "7 ____ 7"],
  "isStyleApplied": true,
  "type": "mcq",
  "options": [
    { "text": "is greater than", "isCorrect": false },
    { "text": "is less than", "isCorrect": false },
    { "text": "is equal to", "isCorrect": true }
  ],
  "feedback": {
    "correct": "Awesome!",
    "incorrect": "Try again. Same numbers?"
  }
}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(rawJson); // convert string to object
      console.log("Payload to submit:", payload);
      const response = await fetch("https://your-backend-api.com/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Submitted successfully!");
        console.log("Response:", data);
      } else {
        alert("Submission failed!");
        console.error(data);
      }
    } catch (err) {
      console.error("Invalid JSON or submission error:", err);
      alert("Invalid JSON or submission error.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Paste Object and Submit</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={20}
          cols={80}
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
        />
        <br />
        <button type="submit">Submit to Backend</button>
      </form>
    </div>
  );
}
