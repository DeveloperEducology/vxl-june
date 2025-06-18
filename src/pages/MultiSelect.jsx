import React, { useState } from "react";
import "./MultiSelect.css";

const MultiSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState([]);

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

  return (
    <div className="multiselect-container">
      <p style={{ fontWeight: "bold", marginBottom: 12 }}>{data?.prompt}</p>
      {data?.options.map((opt, idx) => {
        const label = opt.text || "[Image option]";
        return (
          <label key={idx} className="multiselect-option">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggleOption(opt)}
            />
            <span className="multiselect-label">
              {opt.image ? (
                <img
                  src={opt.image}
                  alt={label}
                  style={{
                    maxHeight: "50px",
                    maxWidth: "150px",
                    objectFit: "contain",
                    verticalAlign: "middle",
                  }}
                />
              ) : (
                label
              )}
            </span>
          </label>
        );
      })}
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default MultiSelect;
