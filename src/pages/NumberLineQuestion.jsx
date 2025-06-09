import React, { useEffect, useRef } from "react";

const NumberLineQuestion = ({
  question,
  userAnswers,
  setUserAnswers,
  feedback,
  setFeedback,
  initializeUserAnswer,
}) => {
  const canvasRef = useRef(null);

  const drawNumberLine = () => {
    const canvas = canvasRef.current;
    if (!canvas || !question.sequence) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;

    // Left arrow
    ctx.beginPath();
    ctx.moveTo(14, height / 2 - 6);
    ctx.lineTo(2, height / 2);
    ctx.lineTo(14, height / 2 + 6);
    ctx.stroke();

    // Middle line
    ctx.beginPath();
    ctx.moveTo(2, height / 2);
    ctx.lineTo(width - 2, height / 2);
    ctx.stroke();

    // Right arrow
    ctx.beginPath();
    ctx.moveTo(width - 14, height / 2 - 6);
    ctx.lineTo(width - 2, height / 2);
    ctx.lineTo(width - 14, height / 2 + 6);
    ctx.stroke();

    // Ticks
    for (let i = 0; i < question.sequence.length; i++) {
      const x =
        (width / question.sequence.length) * i +
        width / (2 * question.sequence.length);
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 8);
      ctx.lineTo(x, height / 2 + 8);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawNumberLine();
    if (!userAnswers[question._id]) {
      setUserAnswers({
        ...userAnswers,
        [question._id]: initializeUserAnswer(question),
      });
    }
  }, [question._id, userAnswers, setUserAnswers, initializeUserAnswer]);

  const handleInputChange = (index, value) => {
    const newValues = [
      ...(userAnswers[question._id] || initializeUserAnswer(question)),
    ];
    newValues[index] = value;
    setUserAnswers({ ...userAnswers, [question._id]: newValues });
    setFeedback("");
  };

  if (!question.sequence) {
    return <p className="text-lg text-red-600">Invalid question data.</p>;
  }

  let nullInputCounter = 0;
  let isFirstNullInput = true; // Flag to track the first null input

  return (
    <div className="p-10 rounded-lg w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-left">
        {question.prompt || "Number Line Question"}
      </h2>
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={500}
          height={40}
          className="w-full h-auto"
        />
        <div className="absolute top-[22px] left-0 w-full flex justify-between px-[1%]">
          {question.sequence.map((number, index) => {
            if (number === null) {
              const inputIndex = nullInputCounter++;
              return (
                <div key={index} className="text-center w-[12.5%]">
                  <input
                    type="number"
                    value={userAnswers[question._id]?.[inputIndex] || ""}
                    onChange={(e) =>
                      handleInputChange(inputIndex, e.target.value)
                    }
                    className="w-full max-w-[50px] h-6 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="?"
                    autoFocus={isFirstNullInput} // Add autofocus to the first null input
                    aria-label={`Answer ${inputIndex + 1} for ${
                      question.prompt || "number line"
                    }`}
                  />
                  {(isFirstNullInput = false)}{" "}
                  {/* Set flag to false after first null input */}
                </div>
              );
            }
            return (
              <div key={index} className="text-center w-[12.5%]">
                <span className="text-sm">{number}</span>
              </div>
            );
          })}
        </div>
      </div>
      {feedback && (
        <p
          className={`text-sm mt-4 ${
            feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default NumberLineQuestion;
