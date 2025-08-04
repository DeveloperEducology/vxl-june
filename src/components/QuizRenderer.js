import React, { useState } from "react";
import InteractiveGraph from "./InteractiveGraph";
import VerticalLineTestGraph from "./VerticalLineTestGraph";
import DomainRangeGraph from "./DomainRangeGraph";


export default function QuizRenderer({ question }) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [result, setResult] = useState("");

  const submit = () => {
    const correct = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
    alert(correct ? "✅ Correct!" : `❌ Correct is ${JSON.stringify(question.correctAnswer)}`);
  };

  return (
    <div>
      <h2>{question.questionText}</h2>

      {/* Vertical Line Test */}
      {question.questionType === "vertical-line-test" && (
        <VerticalLineTestGraph
          graphConfig={question.data.graph}
          onResult={setResult}
        />
      )}
      {result && <p>{result}</p>}

      {/* Domain & Range */}
      {question.questionType === "domain-range" && (
        <DomainRangeGraph
          graphConfig={{ points: question.data.points }}
          onSelection={setUserAnswer}
        />
      )}

      {/* Normal Graph */}
      {question.questionType === "graph-read" && (
        <InteractiveGraph
          graphConfig={question.data.graph}
          onAnswer={(clicked) => setUserAnswer(clicked.y)}
        />
      )}

      {/* Yes/No */}
      {question.answerType === "yes-no" &&
        question.options.map(opt => (
          <button key={opt} onClick={() => setUserAnswer(opt)}>{opt}</button>
        ))
      }

      {/* Input */}
      {(question.answerType === "numeric" || question.answerType === "text") && (
        <input
          placeholder="Your answer"
          value={userAnswer || ""}
          onChange={e => setUserAnswer(
            question.answerType === "numeric" ? Number(e.target.value) : e.target.value
          )}
        />
      )}

      <button onClick={submit}>Submit</button>
    </div>
  );
}
