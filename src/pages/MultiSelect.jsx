import React, { useState } from "react";
import "./MultiSelect.css";

const MultiSelect = ({
  data,
  onNext,
  questionIndex,
  totalQuestions,
  onQuestionSelect,
}) => {
  const [selected, setSelected] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((v) => v !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = data.options.filter((opt) => opt.isCorrect);
    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((s) => correctAnswers.includes(s));
    onNext(isCorrect);
  };

  const handleQuestionSelect = (index) => {
    setShowDropdown(false);
    setSelected([]); // Clear selection on change
    onQuestionSelect(index);
  };

  return (
    <div className="multiselect-container">

      {/* Prompt */}
      <p style={{ fontWeight: "bold", marginBottom: 12 }}>{data?.prompt}</p>

      {/* Options */}
      <div
        className="multiselect-options-wrapper"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {data?.options.map((opt, idx) => {
          const label = opt.text || "[Image option]";
          const isSelected = selected.includes(opt);
          return (
            <div
              key={idx}
              className={`multiselect-option${isSelected ? " selected" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: isSelected ? "2px solid #007bff" : "2px solid #ccc",
                borderRadius: 8,
                padding: 12,
                cursor: "pointer",
                background: isSelected ? "#e6f0ff" : "#fff",
                boxShadow: isSelected ? "0 0 8px #007bff44" : "none",
                transition: "all 0.2s",
                minWidth: 140,
                maxWidth: 200,
                flex: "1 1 140px",
                boxSizing: "border-box",
              }}
              onClick={() => toggleOption(opt)}
            >
              <div className="multiselect-label">
                {opt.image ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <img
                      src={opt.image}
                      alt={label}
                      style={{
                        width: "100%",
                        maxWidth: "150px",
                        height: "auto",
                      }}
                      className="option-image"
                    />
                    {opt.text && (
                      <div
                        className="option-text"
                        style={{ marginTop: 8, textAlign: "center" }}
                      >
                        {opt.text}
                      </div>
                    )}
                  </div>
                ) : (
                  label
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <button
        className="submit-btn"
        onClick={handleSubmit}
        style={{ marginTop: 24, width: "100%", maxWidth: 320 }}
      >
        Submit
      </button>

      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 600px) {
            .multiselect-options-wrapper {
              flex-direction: column !important;
              gap: 16px !important;
            }
            .multiselect-option {
              width: 100% !important;
              max-width: 100% !important;
            }
            .option-image {
              max-width: 100% !important;
              height: auto !important;
            }
            .submit-btn {
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MultiSelect;
