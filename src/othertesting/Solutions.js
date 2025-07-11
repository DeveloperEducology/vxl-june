import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Solutions({ solution = [], show = false }) {
  if (!show || !Array.isArray(solution) || solution.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Solution</h3>
      <div className="text-gray-700">
        {solution.map((part, index) => (
          <span key={index} className="block">
            <BlockMath math={part} />
          </span>
        ))}
      </div>
    </div>
  );
}
