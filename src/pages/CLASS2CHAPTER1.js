import { useState } from 'react';

const CLASS2CHAPTER1 = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const data = {
    lessonId: "math_class2_1",
    questions: [
      {
        type: "fill-in-the-blank",
        question: "Write the after number.",
        items: [
          { "prompt": "7", "answer": "8" },
          { "prompt": "15", "answer": "16" },
          { "prompt": "37", "answer": "38" },
          { "prompt": "50", "answer": "51" },
          { "prompt": "73", "answer": "74" },
          { "prompt": "90", "answer": "91" }
        ]
      },
      {
        type: "fill-in-the-blank",
        question: "Write the before number.",
        items: [
          { "prompt": "9", "answer": "8" },
          { "prompt": "23", "answer": "22" },
          { "prompt": "71", "answer": "70" },
          { "prompt": "88", "answer": "87" },
          { "prompt": "99", "answer": "98" },
          { "prompt": "55", "answer": "54" }
        ]
      },
      {
        type: "fill-in-the-blank",
        question: "Write the between number.",
        items: [
          { "prompt": "3 _ 5", "answer": "4" },
          { "prompt": "21 _ 23", "answer": "22" },
          { "prompt": "39 _ 41", "answer": "40" },
          { "prompt": "80 _ 82", "answer": "81" },
          { "prompt": "65 _ 67", "answer": "66" },
          { "prompt": "55 _ 57", "answer": "56" }
        ]
      },
      {
        type: "comparison",
        question: "Compare using >, < or =",
        items: [
          { "left": 5, "right": 7, "answer": "<" },
          { "left": 18, "right": 16, "answer": ">" },
          { "left": 25, "right": 25, "answer": "=" },
          { "left": 37, "right": 32, "answer": ">" },
          { "left": 49, "right": 54, "answer": "<" },
          { "left": 63, "right": 63, "answer": "=" },
          { "left": 74, "right": 80, "answer": "<" },
          { "left": 85, "right": 58, "answer": ">" },
          { "left": 39, "right": 93, "answer": "<" },
          { "left": 50, "right": 50, "answer": "=" }
        ]
      },
      {
        type: "choose-greatest",
        question: "Circle the greatest number.",
        items: [
          { options: [6, 12, 8, 15], answer: 15 },
          { options: [27, 34, 22, 31], answer: 34 },
          { options: [55, 65, 95, 75], answer: 95 },
          { options: [63, 72, 69, 70], answer: 72 },
          { options: [96, 69, 73, 37], answer: 96 }
        ]
      },
      {
        type: "choose-smallest",
        question: "Circle the smallest number.",
        items: [
          { options: [6, 3, 9, 5], answer: 3 },
          { options: [32, 22, 42, 12], answer: 12 },
          { options: [45, 25, 35, 55], answer: 25 },
          { options: [28, 48, 18, 38], answer: 18 },
          { options: [56, 76, 58, 73], answer: 56 }
        ]
      },
      {
        type: "ordering",
        question: "Arrange the numbers in ascending order.",
        items: [
          { original: [15, 18, 14, 20], answer: [14, 15, 18, 20] },
          { original: [33, 39, 35, 31], answer: [31, 33, 35, 39] },
          { original: [65, 74, 53, 81], answer: [53, 65, 74, 81] },
          { original: [57, 42, 36, 74], answer: [36, 42, 57, 74] },
          { original: [94, 99, 91, 96], answer: [91, 94, 96, 99] }
        ]
      },
      {
        type: "ordering",
        question: "Arrange the numbers in descending order.",
        items: [
          { original: [25, 16, 33, 12], answer: [33, 25, 16, 12] },
          { original: [44, 55, 33, 22], answer: [55, 44, 33, 22] },
          { original: [76, 79, 71, 78], answer: [79, 78, 76, 71] },
          { original: [85, 87, 81, 80], answer: [87, 85, 81, 80] },
          { original: [70, 10, 40, 60], answer: [70, 60, 40, 10] }
        ]
      },
      {
        type: "place-value",
        question: "Write the place value of the numbers.",
        items: [
          { number: 15, tensPlace: 10, onesPlace: 5 },
          { number: 38, tensPlace: 30, onesPlace: 8 },
          { number: 61, tensPlace: 60, onesPlace: 1 },
          { number: 80, tensPlace: 80, onesPlace: 0 },
          { number: 99, tensPlace: 90, onesPlace: 9 },
          { number: 23, tensPlace: 20, onesPlace: 3 }
        ]
      },
      {
        type: "even-odd",
        question: "Circle the objects in pairs and find out if the collections are even or odd. Tick the correct answer.",
        items: [
          { objects: "🐥🐥🦜🦜🧚🧚", count: 6, answer: "Even" },
          { objects: "🚀🚀🚀🚀🚀🚀🚀", count: 7, answer: "Odd" },
          { objects: "🦋🦋🦋🦋🦋", count: 5, answer: "Odd" },
          { objects: "⛵⛵⛵⛵", count: 4, answer: "Even" }
        ]
      }
    ]
  };

  const handleAnswerChange = (sectionIndex, itemIndex, value) => {
    setUserAnswers({
      ...userAnswers,
      [`${sectionIndex}-${itemIndex}`]: value
    });
  };

  const goToNextSection = () => {
    if (currentSectionIndex < data.questions.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getFormattedAnswer = (sectionIndex, itemIndex, item) => {
    const key = `${sectionIndex}-${itemIndex}`;
    const userAnswer = userAnswers[key];
    const sectionType = data.questions[sectionIndex].type;

    let formattedUserAnswer = userAnswer || '-';
    let formattedCorrectAnswer = item.answer;
    let isCorrect = false;

    switch (sectionType) {
      case 'fill-in-the-blank':
        isCorrect = String(userAnswer).trim().toLowerCase() === String(item.answer).trim().toLowerCase();
        break;
      case 'comparison':
        isCorrect = String(userAnswer).trim().toLowerCase() === String(item.answer).trim().toLowerCase();
        break;
      case 'choose-greatest':
      case 'choose-smallest':
        isCorrect = String(userAnswer).trim().toLowerCase() === String(item.answer).trim().toLowerCase();
        break;
      case 'ordering':
        const userArr = String(userAnswer)
          .split(',')
          .map(x => x.trim())
          .filter(Boolean);
        const correctArr = Array.isArray(item.answer)
          ? item.answer.map(String)
          : String(item.answer).split(',');
        isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
        formattedUserAnswer = userAnswer || '-';
        formattedCorrectAnswer = item.answer.join(', ');
        break;
      case 'place-value':
        const [tens, ones] = (userAnswer || ',').split(',');
        const correctTens = item.tensPlace;
        const correctOnes = item.onesPlace;
        const fullCorrect = String(tens).trim() === String(correctTens) && String(ones).trim() === String(correctOnes);
        isCorrect = fullCorrect;
        formattedUserAnswer = `${tens || ''}, ${ones || ''}`;
        formattedCorrectAnswer = `${correctTens}, ${correctOnes}`;
        break;
      case 'even-odd':
        isCorrect = String(userAnswer).trim().toLowerCase() === String(item.answer).trim().toLowerCase();
        break;
      default:
        break;
    }

    return {
      question: getQuestionText(sectionType, item),
      user: formattedUserAnswer,
      correct: formattedCorrectAnswer,
      isCorrect
    };
  };

  const getQuestionText = (sectionType, item) => {
    switch (sectionType) {
      case 'fill-in-the-blank':
        return `Write the after/before/between number: ${item.prompt}`;
      case 'comparison':
        return `Compare: ${item.left} ___ ${item.right}`;
      case 'choose-greatest':
      case 'choose-smallest':
        return `${item.options.join(', ')}`;
      case 'ordering':
        return `Arrange: ${item.original.join(', ')}`;
      case 'place-value':
        return `What is the place value of ${item.number}?`;
      case 'even-odd':
        return `Objects: ${item.objects}`;
      default:
        return '';
    }
  };

  const getAllResults = () => {
    const results = [];
    data.questions.forEach((section, sectionIndex) => {
      section.items.forEach((item, itemIndex) => {
        results.push(getFormattedAnswer(sectionIndex, itemIndex, item));
      });
    });
    return results;
  };

  const calculateScore = () => {
    const results = getAllResults();
    return results.filter(r => r.isCorrect).length;
  };

  const totalQuestions = data.questions.reduce((acc, curr) => acc + curr.items.length, 0);

  const currentSection = data.questions[currentSectionIndex];

  // Draggable component for "Choose the greatest/smallest number"
  const DraggableList = ({ itemIndex, options, answer }) => {
    const [items, setItems] = useState([...options]);
    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, index) => {
      setDraggedItem(items[index]);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (draggedItem === null || items[index] === draggedItem) return;

      const draggedIndex = items.indexOf(draggedItem);
      const newItems = [...items];
      const [dragged] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, dragged);
      setItems(newItems);
      setDraggedItem(dragged);
    };

    const handleDrop = () => {
      const selected = items[0]; // Assume first item is selected
      handleAnswerChange(currentSectionIndex, itemIndex, selected);
    };

    return (
      <div className="mb-6">
        <p className="text-lg mb-2">Options: {options.join(', ')}</p>
        <p className="text-sm text-gray-500 mb-2">Drag and drop to choose the greatest number</p>
        <div
          className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded bg-white min-h-[60px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-1 px-3 rounded shadow cursor-move transition duration-200 whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-green-600">
          Selected: <strong>{items[0]}</strong>
        </p>
      </div>
    );
  };

  const renderQuestion = (item, index) => {
    switch (currentSection.type) {
      case 'fill-in-the-blank':
        return (
          <div key={index} className="mb-6">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <p className="text-lg mb-2 md:mb-0">{item.prompt}</p>
              <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
            value={userAnswers[`${currentSectionIndex}-${index}`] || ''}
            onChange={(e) => handleAnswerChange(currentSectionIndex, index, e.target.value)}
              />
            </div>
          </div>
        );
      case 'comparison':
        return (
          <div key={index} className="mb-6 flex items-center gap-4">
            <span className="text-xl font-bold">{item.left}</span>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userAnswers[`${currentSectionIndex}-${index}`] || ''}
              onChange={(e) => handleAnswerChange(currentSectionIndex, index, e.target.value)}
            >
              <option value="">Select</option>
              <option value=">">{'>'}</option>
              <option value="<">{'<'}</option>
              <option value="=">=</option>
            </select>
            <span className="text-xl font-bold">{item.right}</span>
          </div>
        );
      case 'choose-greatest':
      case 'choose-smallest':
        return <DraggableList key={index} itemIndex={index} options={item.options} answer={item.answer} />;
      case 'ordering':
        return (
          <div key={index} className="mb-6">
            <p className="text-lg mb-2">Original: {item.original.join(', ')}</p>
            <p>Arrange them below:</p>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-md mt-2"
              placeholder="e.g., 14, 15, 18, 20"
              value={userAnswers[`${currentSectionIndex}-${index}`] || ''}
              onChange={(e) => handleAnswerChange(currentSectionIndex, index, e.target.value)}
            />
          </div>
        );
      case 'place-value':
        return (
          <div key={index} className="mb-6">
            <p className="text-lg mb-2">Number: {item.number}</p>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm">Tens Place</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-24"
                  value={(userAnswers[`${currentSectionIndex}-${index}`] || '').split(',')[0] || ''}
                  onChange={(e) => {
                    const tens = e.target.value;
                    const ones = (userAnswers[`${currentSectionIndex}-${index}`] || '').split(',')[1] || '';
                    handleAnswerChange(currentSectionIndex, index, `${tens},${ones}`);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm">Ones Place</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-24"
                  value={(userAnswers[`${currentSectionIndex}-${index}`] || '').split(',')[1] || ''}
                  onChange={(e) => {
                    const ones = e.target.value;
                    const tens = (userAnswers[`${currentSectionIndex}-${index}`] || '').split(',')[0] || '';
                    handleAnswerChange(currentSectionIndex, index, `${tens},${ones}`);
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 'even-odd':
        return (
          <div key={index} className="mb-6">
            <p className="text-lg mb-2">{item.objects}</p>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userAnswers[`${currentSectionIndex}-${index}`] || ''}
              onChange={(e) => handleAnswerChange(currentSectionIndex, index, e.target.value)}
            >
              <option value="">Select</option>
              <option value="Even">Even</option>
              <option value="Odd">Odd</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  if (showResults) {
    const results = getAllResults();
    const score = calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Results</h1>
          <p className="text-xl mb-6">
            You scored <span className="font-bold text-blue-600">{score}</span> out of{' '}
            <span className="font-bold text-green-600">{totalQuestions}</span>
          </p>

          <div className="space-y-4">
            {results.map((result, i) => (
              <div key={i} className={`p-4 rounded border ${result.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p><strong>Question:</strong> {result.question}</p>
                <p><strong>Your Answer:</strong> {result.user}</p>
                <p><strong>Correct Answer:</strong> {result.correct}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setCurrentSectionIndex(0);
              setUserAnswers({});
            }}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Math Quiz</h1>
            <span className="text-sm text-gray-500">Section {currentSectionIndex + 1} of {data.questions.length}</span>
          </div>
          <h2 className="text-xl text-gray-700 font-medium">{currentSection.question}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSection.items.map((item, index) => renderQuestion(item, index))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={goToNextSection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
          >
            {currentSectionIndex === data.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CLASS2CHAPTER1;