import React, { useEffect, useState, useRef } from "react";

// MathRenderer component
const MathRenderer = ({ latex }) => {
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    if (!window.katex) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js";
      script.async = true;
      script.onload = () => setKatexLoaded(true);
      script.onerror = () => console.error("Failed to load KaTeX script");
      document.head.appendChild(script);

      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";
      css.onerror = () => console.error("Failed to load KaTeX CSS");
      document.head.appendChild(css);
    } else {
      setKatexLoaded(true);
    }
  }, []);

  if (!katexLoaded) return <p className="text-gray-500">Loading KaTeX...</p>;

  try {
    return (
      <div className="my-4">
        <span
          dangerouslySetInnerHTML={{
            __html: window.katex.renderToString(latex, {
              throwOnError: false,
              displayMode: true,
            }),
          }}
        />
      </div>
    );
  } catch (e) {
    console.error("KaTeX rendering error:", e);
    return <p className="text-red-500">Invalid LaTeX: {latex}</p>;
  }
};

// piecesToLatex function
function piecesToLatex(pieces) {
  return pieces
    .map((piece) => {
      if (!piece) return "";
      switch (piece.objectType) {
        case "PlainText":
          return piece.text ? piece.text.replace(/\*/g, "\\times ") : "";
        case "QMDecimal":
          return piece.nonRepeatingPart || "";
        case "QMExponent":
          if (piece.latex) return piece.latex;
          if (piece.children?.length === 2) {
            const base = piecesToLatex([piece.children[0]]);
            const exponent = piecesToLatex([piece.children[1]]);
            return `{${base}}^{${exponent}}`;
          }
          return "";
        case "QMFraction":
          if (piece.latex) return piece.latex;
          if (piece.children?.length === 2) {
            const numerator = piecesToLatex([piece.children[0]]);
            const denominator = piecesToLatex([piece.children[1]]);
            return `\\frac{${numerator}}{${denominator}}`;
          }
          return "";
        case "QMAlgebraic":
          if (piece.latex) return piece.latex;
          return piece.children ? piece.children.map((child) => piecesToLatex([child])).join("") : "";
        case "QMEquation":
          if (piece.latex) return `\\[${piece.latex}\\]`;
          return piece.children ? piece.children.map((child) => piecesToLatex([child])).join("") : "";
        case "QMInput":
          return `\\boxed{\\text{${piece.id || "Input"}}}`;
        case "QMHTML":
          return `\\text{[HTML: ${piece.content?.substring(0, 20) || ""}...]}`;
        default:
          console.warn("Unknown piece type:", piece.objectType);
          return "";
      }
    })
    .join("");
}

const EditorWithMathRenderer = () => {
  const [pieces, setPieces] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [latexValue, setLatexValue] = useState("");
  const [error, setError] = useState("");
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  useEffect(() => {
    // Load Quill JS and CSS if not already loaded
    if (!window.Quill) {
      const quillScript = document.createElement("script");
      quillScript.src = "https://cdn.quilljs.com/1.3.6/quill.js";
      quillScript.async = true;
      quillScript.onload = () => setQuillLoaded(true);
      document.head.appendChild(quillScript);

      const quillCSS = document.createElement("link");
      quillCSS.rel = "stylesheet";
      quillCSS.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
      document.head.appendChild(quillCSS);
    } else {
      setQuillLoaded(true);
    }

    return () => {
      // Cleanup
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeInput || !quillLoaded) return;

    const needsQuill = ["PlainText", "QMHTML"].includes(activeInput);
    
    if (needsQuill && editorRef.current && !quillRef.current) {
      try {
        const quillInstance = new window.Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          },
          placeholder: activeInput === "QMHTML" ? "Enter HTML content..." : "Enter plain text...",
        });

        quillRef.current = quillInstance;

        quillInstance.on("text-change", () => {
          const content = quillInstance.root.innerHTML;
          setInputValue(content !== "<p><br></p>" ? content : "");
        });
      } catch (e) {
        console.error("Quill initialization error:", e);
        setError("Failed to initialize text editor. Please refresh the page.");
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, [activeInput, quillLoaded]);

  const showInput = (inputType) => {
    setActiveInput(inputType);
    setInputValue("");
    setInputValue2("");
    setLatexValue("");
    setError("");
    if (quillRef.current) {
      quillRef.current.root.innerHTML = "";
    }
  };

  const addComponent = () => {
    if (!activeInput) {
      setError("No input type selected.");
      return;
    }

    const requiresInput = [, "QMDecimal", "QMAlgebraic", "QMEquation", "QMHTML"];
    const requiresDualInput = ["QMExponent", "QMFraction", "QMInput"];
    const hasValidInput = inputValue.trim() || latexValue.trim();
    const hasValidDualInput = inputValue.trim() && inputValue2.trim();

    if (requiresInput.includes(activeInput) && !hasValidInput) {
      setError("Please provide a valid input or LaTeX expression.");
      return;
    }
    if (requiresDualInput.includes(activeInput) && !hasValidDualInput) {
      setError("Both fields are required.");
      return;
    }

    let newPiece;
    try {
      switch (activeInput) {
        case "PlainText":
          newPiece = { objectType: "PlainText", text: inputValue };
          break;
        case "QMDecimal":
          newPiece = { objectType: "QMDecimal", nonRepeatingPart: inputValue };
          break;
        case "QMExponent":
          newPiece = {
            objectType: "QMExponent",
            latex: latexValue || undefined,
            children: [
              { objectType: "QMDecimal", nonRepeatingPart: inputValue },
              { objectType: "QMDecimal", nonRepeatingPart: inputValue2 },
            ],
          };
          break;
        case "QMFraction":
          newPiece = {
            objectType: "QMFraction",
            latex: latexValue || undefined,
            children: [
              { objectType: "QMDecimal", nonRepeatingPart: inputValue },
              { objectType: "QMDecimal", nonRepeatingPart: inputValue2 },
            ],
          };
          break;
        case "QMAlgebraic":
          newPiece = {
            objectType: "QMAlgebraic",
            latex: latexValue || undefined,
            children: inputValue
              .split(/([+\-*/])/).filter((p) => p.trim())
              .map((part) => {
                if (["+", "-", "*", "/"].includes(part)) {
                  return { objectType: "PlainText", text: ` ${part} ` };
                }
                return { objectType: "QMDecimal", nonRepeatingPart: part };
              }),
          };
          break;
        case "QMEquation":
          newPiece = {
            objectType: "QMEquation",
            latex: latexValue || undefined,
            children: inputValue
              .split(/([=+\-*/])/).filter((p) => p.trim())
              .map((part) => {
                if (["=", "+", "-", "*", "/"].includes(part)) {
                  return { objectType: "PlainText", text: ` ${part} ` };
                }
                return { objectType: "QMDecimal", nonRepeatingPart: part };
              }),
          };
          break;
        case "QMInput":
          newPiece = {
            objectType: "QMInput",
            id: inputValue,
            correctAnswer: inputValue2,
          };
          break;
        case "QMHTML":
          newPiece = { objectType: "QMHTML", content: inputValue };
          break;
        default:
          setError("Invalid input type.");
          return;
      }

      setPieces([...pieces, newPiece]);
      setActiveInput(null);
      setInputValue("");
      setInputValue2("");
      setLatexValue("");
      setError("");
      if (quillRef.current) {
        quillRef.current.root.innerHTML = "";
      }
    } catch (e) {
      console.error("Error adding component:", e);
      setError("Failed to add component. Please try again.");
    }
  };

  const clearAll = () => {
    setPieces([]);
    setActiveInput(null);
    setInputValue("");
    setInputValue2("");
    setLatexValue("");
    setError("");
    if (quillRef.current) {
      quillRef.current.root.innerHTML = "";
    }
  };

  const exportJSON = () => {
    const question = {
      _id: `quiz_${Date.now()}`,
      id: `q${pieces.length + 1}`,
      pieces,
    };
    try {
      const blob = new Blob([JSON.stringify(question, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "math_quiz_question.json";
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error exporting JSON:", e);
      setError("Failed to export JSON. Please try again.");
    }
  };

  const renderInputField = () => {
    if (!activeInput) return null;

    const inputConfig = {
      PlainText: {
        label: "Enter plain text:",
        fields: 1,
        useQuill: false,
      },
      QMDecimal: {
        label: "Enter a number:",
        fields: 1,
        useQuill: false,
      },
      QMExponent: {
        label: "Enter exponent:",
        fields: 2,
        labels: ["Base", "Exponent"],
        useQuill: false,
        showLatex: true,
      },
      QMFraction: {
        label: "Enter fraction:",
        fields: 2,
        labels: ["Numerator", "Denominator"],
        useQuill: false,
        showLatex: true,
      },
      QMAlgebraic: {
        label: "Enter algebraic expression (e.g., 2x + 3y):",
        fields: 1,
        useQuill: false,
        showLatex: true,
      },
      QMEquation: {
        label: "Enter equation (e.g., 2x + 3 = 5):",
        fields: 1,
        useQuill: false,
        showLatex: true,
      },
      QMInput: {
        label: "Enter input field:",
        fields: 2,
        labels: ["Input ID", "Correct Answer"],
        useQuill: false,
      },
      QMHTML: {
        label: "Enter HTML content:",
        fields: 1,
        useQuill: true,
      },
    };

    const config = inputConfig[activeInput];

    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2 text-lg">{config.label}</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {config.useQuill ? (
          <div>
            {!quillLoaded ? (
              <p className="text-gray-500">Loading text editor...</p>
            ) : (
              <>
                <div
                  ref={editorRef}
                  className="bg-white border rounded-lg min-h-[150px]"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={addComponent}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => showInput(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={config.fields === 1 ? config.label : config.labels[0]}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {config.fields === 2 && (
                <input
                  type="text"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
                  placeholder={config.labels[1]}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            {config.showLatex && (
              <input
                type="text"
                value={latexValue}
                onChange={(e) => setLatexValue(e.target.value)}
                placeholder="Enter LaTeX (optional, e.g., x^2 or \\frac{1}{2})"
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={addComponent}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => showInput(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Math Expression Editor</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { type: "PlainText", label: "Add Text" },
          { type: "QMDecimal", label: "Add Number" },
          { type: "QMExponent", label: "Add Exponent" },
          { type: "QMFraction", label: "Add Fraction" },
          { type: "QMAlgebraic", label: "Add Expression" },
          { type: "QMEquation", label: "Add Equation" },
          { type: "QMInput", label: "Add Input" },
          { type: "QMHTML", label: "Add HTML" },
        ].map(({ type, label }) => (
          <button
            key={type}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => showInput(type)}
          >
            {label}
          </button>
        ))}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={clearAll}
        >
          Clear All
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          onClick={exportJSON}
        >
          Export JSON
        </button>
      </div>

      {renderInputField()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2 text-lg">Components</h3>
          <ul className="border rounded-lg p-2 bg-gray-50">
            {pieces.length === 0 ? (
              <li className="text-gray-500">No components added yet</li>
            ) : (
              pieces.map((piece, i) => (
                <li key={i} className="py-1 border-b last:border-b-0">
                  {piece.objectType === "PlainText" && `Text: "${piece.text}"`}
                  {piece.objectType === "QMDecimal" && `Number: ${piece.nonRepeatingPart}`}
                  {piece.objectType === "QMExponent" &&
                    `Exponent: ${piece.children?.[0]?.nonRepeatingPart || ""}^${piece.children?.[1]?.nonRepeatingPart || ""}${piece.latex ? ` (LaTeX: ${piece.latex})` : ""}`}
                  {piece.objectType === "QMFraction" &&
                    `Fraction: ${piece.children?.[0]?.nonRepeatingPart || ""}/${piece.children?.[1]?.nonRepeatingPart || ""}${piece.latex ? ` (LaTeX: ${piece.latex})` : ""}`}
                  {piece.objectType === "QMAlgebraic" &&
                    `Expression: ${piece.children?.map((c) => c.text || c.nonRepeatingPart).join("") || ""}${piece.latex ? ` (LaTeX: ${piece.latex})` : ""}`}
                  {piece.objectType === "QMEquation" &&
                    `Equation: ${piece.children?.map((c) => c.text || c.nonRepeatingPart).join("") || ""}${piece.latex ? ` (LaTeX: ${piece.latex})` : ""}`}
                  {piece.objectType === "QMInput" &&
                    `Input: ${piece.id} (Correct answer: ${piece.correctAnswer})`}
                  {piece.objectType === "QMHTML" &&
                    `HTML: ${piece.content?.substring(0, 50) || ""}...`}
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-lg">Rendered Preview</h3>
          <div className="border rounded-lg p-4 bg-white min-h-[80px]">
            <MathRenderer latex={piecesToLatex(pieces)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorWithMathRenderer;