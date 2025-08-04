function generateNumberLineQuestion() {
  // Generate random start and end points (ensuring even numbers exist between them)
  const start = Math.floor(Math.random() * 10) - 5; // -5 to 5
  const end = start + 6; // Always show 7 numbers
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const evenNumbers = numbers.filter(n => n % 2 === 0);
  
  return {
    type: "number-line",
    question: "Select the even numbers on the number line.",
    answer: evenNumbers,
    range: { start, end },
    numbers,
    correctDots: evenNumbers,
    userDots: []
  };
}

function NumberLineQuestion({ question, onAnswer, showResult }) {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const svgRef = useRef(null);
  const width = 400;
  const height = 100;
  const padding = 50;

  const handleNumberClick = (number) => {
    if (showResult) return;
    
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  useEffect(() => {
    if (showResult) return;
    onAnswer(selectedNumbers);
  }, [selectedNumbers, showResult, onAnswer]);

  // Calculate positions
  const numberPositions = question.numbers.map((num, i) => {
    const x = padding + (i * ((width - 2 * padding) / (question.numbers.length - 1)));
    return { number: num, x };
  });

  return (
    <div className="flex flex-col items-center mt-6">
      <svg ref={svgRef} width={width} height={height} className="border-b-2 border-gray-400">
        {/* Number line */}
        <line 
          x1={padding} 
          y1={height/2} 
          x2={width-padding} 
          y2={height/2} 
          stroke="black" 
          strokeWidth="2"
        />
        
        {/* Ticks and numbers */}
        {numberPositions.map(({number, x}) => (
          <g key={number} onClick={() => handleNumberClick(number)} className="cursor-pointer">
            <line 
              x1={x} 
              y1={height/2 - 10} 
              x2={x} 
              y2={height/2 + 10} 
              stroke="black" 
              strokeWidth="2"
            />
            <text 
              x={x} 
              y={height/2 + 30} 
              textAnchor="middle" 
              fontSize="16"
              fill={showResult && question.answer.includes(number) ? "green" : "black"}
            >
              {number}
            </text>
            
            {/* User dots */}
            {selectedNumbers.includes(number) && (
              <circle 
                cx={x} 
                cy={height/2} 
                r="8" 
                fill={showResult 
                  ? question.answer.includes(number) 
                    ? "green" 
                    : "red"
                  : "blue"}
              />
            )}
            
            {/* Correct answer indicators */}
            {showResult && question.answer.includes(number) && !selectedNumbers.includes(number) && (
              <circle 
                cx={x} 
                cy={height/2} 
                r="8" 
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </g>
        ))}
      </svg>
      
      {showResult && (
        <div className="mt-4 text-lg">
          {selectedNumbers.some(n => !question.answer.includes(n)) ? (
            <span className="text-red-600">Some incorrect selections</span>
          ) : selectedNumbers.length === question.answer.length ? (
            <span className="text-green-600">Perfect! All even numbers selected</span>
          ) : (
            <span className="text-yellow-600">Missed some even numbers</span>
          )}
        </div>
      )}
    </div>
  );
}

// In your main component's renderQuestionInput function:
const renderQuestionInput = () => {
  if (!currentQuestion) return null;

  switch (currentQuestion.type) {
    // ... other cases
    case "number-line":
      return (
        <NumberLineQuestion
          question={currentQuestion}
          onAnswer={(selected) => setUserAnswer(selected)}
          showResult={showResult}
        />
      );
    // ... other cases
  }
};

// Update your handleSubmit to handle number-line type:
const handleSubmit = () => {
  // ... other checks
  
  if (currentQuestion.type === "number-line") {
    const correctAnswers = currentQuestion.answer;
    const userAnswers = userAnswer || [];
    
    isCorrect = correctAnswers.length === userAnswers.length &&
               correctAnswers.every(ans => userAnswers.includes(ans));
  }
  // ... rest of handleSubmit
};