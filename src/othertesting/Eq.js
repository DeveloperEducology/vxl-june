import EquationRenderer from "./EquationRenderer";

export default function Eq() {
  const rawQuestions = [
    [
      { objectType: "PlainText", text: "Solve for " },
      { objectType: "QMAlgebraic", latex: "x" },
      { objectType: "PlainText", text: ": " },
      { objectType: "QMEquation", latex: "x^2 - 4 = 0" },
      { objectType: "PlainText", text: ". Answer: " },
      { objectType: "QMInput", id: "input_1", correctAnswer: "2" },
    ],
    [
      { objectType: "PlainText", text: "Evaluate: " },
      { objectType: "QMEquation", latex: "\\frac{6}{2} + 1" },
      { objectType: "PlainText", text: ". Answer: " },
      { objectType: "QMInput", id: "input_2", correctAnswer: "4" },
    ],
    [
      { objectType: "PlainText", text: "What is the value of " },
      { objectType: "QMEquation", latex: "3^2 + 4^2" },
      { objectType: "PlainText", text: "? Answer: " },
      { objectType: "QMInput", id: "input_3", correctAnswer: "25" },
    ],
    [
      { objectType: "PlainText", text: "Integrate: " },
      { objectType: "QMEquation", latex: "\\int x^2 \\, dx" },
      { objectType: "PlainText", text: ". Answer: " },
      {
        objectType: "QMInput",
        id: "input_4",
        correctAnswer: "\\frac{1}{3}x^3 + C",
      },
    ],
    [
      { objectType: "PlainText", text: "Find the indefinite integral of " },
      { objectType: "QMEquation", latex: "\\int \\sin(x) \\, dx" },
      { objectType: "PlainText", text: ". Answer: " },
      { objectType: "QMInput", id: "input_5", correctAnswer: "-\\cos(x) + C" },
    ],
    [
      { objectType: "PlainText", text: "Evaluate the definite integral: " },
      { objectType: "QMEquation", latex: "\\int_0^1 2x \\, dx" },
      { objectType: "PlainText", text: ". Answer: " },
      { objectType: "QMInput", id: "input_6", correctAnswer: "1" },
    ],
    [
      { objectType: "PlainText", text: "solve for: " },
      {
        objectType: "QMEquation",
        latex:
          "\\sum_{k=1}^{13} \\frac{1}{\\sin\\left( \\frac{\\pi}{4} + \\frac{(k - 1)\\pi}{6} \\right) \\cdot \\sin\\left( \\frac{\\pi}{4} + \\frac{k\\pi}{6} \\right)} =",
      },
      { objectType: "QMInput", id: "input_6", correctAnswer: "1" },
    ],
  ];

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

  return (
    <div className="space-y-6">
      {rawQuestions.map((raw, idx) => (
        <EquationRenderer key={idx} pieces={transformPieces(raw)} />
      ))}
    </div>
  );
}
