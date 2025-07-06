import React from "react";

const SolutionBox = ({ showSolution, solutionKey, setShowSolution }) => {
  if (!showSolution || !solutionKey) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      <div className="font-semibold text-yellow-800 mb-2">Solution:</div>
      <p className="text-sm text-gray-700">
        {solutionKey?.formula || "No formula provided."}
      </p>
      {solutionKey?.steps?.length > 0 ? (
        <ol className="list-decimal pl-5 mt-2">
          {solutionKey.steps.map((step, index) => (
            <li key={index} className="text-sm text-gray-700 mb-1">
              {step}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-700">No steps provided.</p>
      )}
    </div>
  );
};

export default SolutionBox;






