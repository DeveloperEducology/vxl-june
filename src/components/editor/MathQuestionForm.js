import React, { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const MathQuestionForm = () => {
  const [pieces, setPieces] = useState([
    {
      id: Date.now(),
      objectType: "PlainText",
      text: "Solve the following equation for ",
      style: "row",
      nextObject: "continue-row",
      fontSize: 16,
    },
    {
      id: Date.now() + 1,
      objectType: "QMAlgebraic",
      latex: "x",
      children: [{ objectType: "PlainText", text: "x" }],
      style: "row",
      nextObject: "continue-row",
      fontSize: 18,
    },
    {
      id: Date.now() + 2,
      objectType: "PlainText",
      text: ": ",
      style: "row",
      nextObject: "continue-row",
      fontSize: 16,
    },
    {
      id: Date.now() + 3,
      objectType: "QMEquation",
      latex: "2x + \\frac{3}{4} = x^2",
      children: [
        { objectType: "PlainText", text: "2x + 3/4" },
        { objectType: "PlainText", text: " = " },
        {
          objectType: "QMExponent",
          children: [
            { objectType: "PlainText", text: "x" },
            { objectType: "PlainText", text: "2" },
          ],
        },
      ],
      style: "row",
      nextObject: "continue-row",
      fontSize: 18,
    },
    {
      id: Date.now() + 4,
      objectType: "QMInput",
      correctAnswer: "1.5",
      placeholder: "Enter answer",
      style: "row",
      nextObject: "continue-row",
      fontSize: 16,
    },
  ]);

  const [jsonOutput, setJsonOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAddPiece = () => {
    setPieces((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        objectType: "PlainText",
        text: "",
        latex: "",
        style: "row",
        nextObject: "continue-row",
        fontSize: 16,
      },
    ]);
  };

  const handleRemovePiece = (id) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePiece = (id, field, value) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: field === "fontSize" ? parseInt(value) || 16 : value,
            }
          : p
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const questionObject = {
      lessonId: "684a5b91248b2f20c8bc36a7",
      type: "EQUATION",
      pieces: pieces.map((p) => {
        switch (p.objectType) {
          case "PlainText":
            return {
              objectType: "PlainText",
              text: p.text,
              style: p.style,
              nextObject: p.nextObject,
              fontSize: p.fontSize,
            };
          case "QMAlgebraic":
          case "QMEquation":
            return {
              objectType: p.objectType,
              latex: p.latex,
              children: [
                {
                  objectType: "PlainText",
                  text: p.latex.split("=")[0].trim(),
                },
              ],
              style: p.style,
              nextObject: p.nextObject,
              fontSize: p.fontSize,
            };
          case "QMInput":
            return {
              objectType: "QMInput",
              id: `input_${p.id}`,
              correctAnswer: p.correctAnswer || "",
              placeholder: p.placeholder || "Answer",
              style: p.style,
              nextObject: p.nextObject,
              fontSize: p.fontSize,
            };
          default:
            return {};
        }
      }),
    };

    setJsonOutput(JSON.stringify(questionObject, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderPiece = (piece) => {
    const fontSize = piece.fontSize || 16;
    const style = { fontSize: `${fontSize}px` };

    switch (piece.objectType) {
      case "PlainText":
        return (
          <span key={piece.id} className="text-gray-800" style={style}>
            {piece.text}
          </span>
        );
      case "QMAlgebraic":
      case "QMEquation":
        return <BlockMath key={piece.id} math={piece.latex} style={style} />;
      case "QMInput":
        return (
          <input
            key={piece.id}
            type="text"
            placeholder={piece.placeholder}
            className="p-1 border border-gray-300 rounded-md"
            style={style}
            disabled
          />
        );
      default:
        return null;
    }
  };

  const renderPieces = (piecesList) => {
    const groupedPieces = [];
    let currentGroup = [];
    let currentContainerType = "row";

    piecesList.forEach((piece, index) => {
      const isLastPiece = index === piecesList.length - 1;
      const style = piece.style || "row";
      const nextObject = piece.nextObject || "continue-row";

      currentGroup.push(piece);

      if (isLastPiece || nextObject === "new-column") {
        const containerClasses =
          currentContainerType === "row"
            ? "flex flex-row flex-wrap gap-2 items-center"
            : "flex flex-col gap-2";

        groupedPieces.push(
          <div key={`group-${index}`} className={containerClasses}>
            {currentGroup.map(renderPiece)}
          </div>
        );

        currentGroup = [];
        currentContainerType = style === "column" ? "column" : "row";
      } else if (style === "row" && nextObject === "continue-row") {
        currentContainerType = "row";
      }
    });

    return groupedPieces;
  };

  const renderStyleSelectors = (piece, index) => (
    <>
      <label className="block text-sm font-medium text-gray-700 mt-2">
        Style
      </label>
      <select
        value={piece.style}
        onChange={(e) => handleUpdatePiece(piece.id, "style", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="row">Row</option>
        <option value="column">Column</option>
      </select>

      {piece.style === "row" && (
        <>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Next Object
          </label>
          <select
            value={piece.nextObject}
            onChange={(e) =>
              handleUpdatePiece(piece.id, "nextObject", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="continue-row">Continue in Row</option>
            <option value="new-column">New Column</option>
          </select>
        </>
      )}

      <label className="block text-sm font-medium text-gray-700 mt-2">
        Font Size
      </label>
      <input
        type="number"
        min="10"
        max="48"
        value={piece.fontSize}
        onChange={(e) =>
          handleUpdatePiece(piece.id, "fontSize", e.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-5 p-5">
      <div className="flex-1 bg-white p-5 rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl font-bold text-center mb-5">
          Dynamic Question Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {pieces.map((piece, index) => (
            <div key={piece.id} className="border p-4 rounded-md relative">
              <button
                type="button"
                onClick={() => handleRemovePiece(piece.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Object Type
                </label>
                <select
                  value={piece.objectType}
                  onChange={(e) =>
                    handleUpdatePiece(piece.id, "objectType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="PlainText">Plain Text</option>
                  <option value="QMAlgebraic">Algebraic Expression</option>
                  <option value="QMEquation">Equation</option>
                  <option value="QMInput">Input Field</option>
                </select>
              </div>

              {piece.objectType === "PlainText" && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Text
                  </label>
                  <input
                    type="text"
                    value={piece.text || ""}
                    onChange={(e) =>
                      handleUpdatePiece(piece.id, "text", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {["QMAlgebraic", "QMEquation"].includes(piece.objectType) && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    LaTeX Equation
                  </label>
                  <input
                    type="text"
                    value={piece.latex || ""}
                    onChange={(e) =>
                      handleUpdatePiece(piece.id, "latex", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {piece.objectType === "QMInput" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={piece.placeholder || ""}
                      onChange={(e) =>
                        handleUpdatePiece(
                          piece.id,
                          "placeholder",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={piece.correctAnswer || ""}
                      onChange={(e) =>
                        handleUpdatePiece(
                          piece.id,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}

              {renderStyleSelectors(piece, index)}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPiece}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            ➕ Add New Element
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            Generate JSON
          </button>
        </form>

        {jsonOutput && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Generated JSON</h2>
              <button
                onClick={handleCopy}
                className="relative text-gray-600 hover:text-blue-600"
                title="Copy JSON"
              >
                📋{" "}
                {copied && (
                  <span className="absolute -top-6 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Question Preview</h2>
        <div className="p-4 bg-gray-100 rounded-md min-h-[60px] flex flex-col gap-2">
          {renderPieces(pieces)}
        </div>
      </div>
    </div>
  );
};

export default MathQuestionForm;
