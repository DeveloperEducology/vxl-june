import React from "react";
import MathQuiz from "./MathQuiz"; // Make sure this matches your file name

const questions = [
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        objectType: "QMAlgebraic",
        children: [
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "What is the value of x in the equation ",
          },
        ],
      },
      {
        objectType: "QMAlgebraic",
        children: [
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "2x ",
          },
          {
            objectType: "PlainText",
            text: " + ",
          },
          {
            objectType: "QMDecimal",
            nonRepeatingPart: " 3 = 7",
          },
        ],
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "4",
      },
      {
    "objectType": "QMHTML",
    "content": "<p onClick={read}> <span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Each shelf has 5 books.</span></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">How many books are on 6 shelves?</span></p><p><br></p>"
  }
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        text: "What is the sum of ",
        objectType: "PlainText",
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: "2 + 2 = ",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "4",
      },
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        text: " The graph shows an ellipse. What is its centre?",
        objectType: "PlainText",
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: "(",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "1",
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: ",",
      },
      {
        objectType: "QMInput",
        id: "2",
        correctAnswer: "2",
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: ")",
      },
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        objectType: "QMHTML",
        content: `<ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>HTML playground</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>This is a sample paragraph with a <code><strong>data</strong></code><strong> attribute</strong>.</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong style=\"color: rgb(211, 47, 47);\">Spoiler alert</strong> created with a <code>details</code> element!</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>This demo uses elements such as <code>abbr</code>, <code>article</code>, <code>section</code>, <code>aside</code>, and <code>details</code>.</li></ol><h2><br></h2><p><br></p>`,
      },
      {
        text: "add the fraction = ",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "2",
      },
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        text: "FInd the ",
        objectType: "PlainText",
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: "2",
      },
      {
        objectType: "QMAlgebraic",
        children: [
          {
            objectType: "PlainText",
            text: " + ",
          },
        ],
      },
      {
        objectType: "QMDecimal",
        nonRepeatingPart: "2",
      },
      {
        objectType: "QMFraction",
        children: [
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "3",
          },
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "4",
          },
        ],
      },
      {
        text: "=",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "19/4",
      },
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        text: "2, 3, 4, 5, ",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "6",
      },
      {
        objectType: "QMInput",
        id: "2",
        correctAnswer: "7",
      },
    ],
  },
  {
    id: "w2",
    pieces: [
      {
        text: "fdsfsdfdsfdsfdsfdsf",
        objectType: "PlainText",
      },
      {
        objectType: "QMAlgebraic",
        children: [
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "2x",
          },
          {
            objectType: "PlainText",
            text: " + ",
          },
          {
            objectType: "QMDecimal",
            nonRepeatingPart: "3y",
          },
        ],
      },
    ],
  },
  {
    id: "q0",
    pieces: [
      {
        text: "Find the x-intercept of the following equation. Simplify your answer.",
        objectType: "PlainText",
      },
      {},
      {
        text: "2, ",
        objectType: "PlainText",
      },
      {
        text: "3, ",
        objectType: "PlainText",
      },
      {
        text: "5, ",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "input1", // Added required id field
        correctAnswer: "6", // Changed to correct answer for x-intercept of x + 10y = 1
      },
    ],
  },
  {
    id: "q0",
    pieces: [
      {
        text: "Find the x-intercept of the following equation. Simplify your answer.",
        objectType: "PlainText",
      },
      {},
      {
        text: "x-intercept 2x+y = ",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "input1", // Added required id field
        correctAnswer: "1", // Changed to correct answer for x-intercept of x + 10y = 1
      },
    ],
  },
  {
    id: "q1",
    pieces: [
      {
        text: "Find the x-intercept of the following equation. Simplify your answer.",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "3",
        correctAnswer: "3",
      },
    ],
  },
  {
    lessonId: "68111474a6aafb33e7aed3b8",
    type: "TEST",
    pieces: [
      {
        text: "Find the x-intercept of the following equation. Simplify your answer.",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "3",
        correctAnswer: "3",
      },
      {
        text: "Find the y-intercept of the following equation. Simplify your answer.",
        objectType: "PlainText",
      },
      {
        objectType: "QMInput",
        id: "1",
        correctAnswer: "4",
      },
    ],
  },
];

const Math = () => {



  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Math Quiz</h2>
      <MathQuiz questions={questions} />
    </div>
  );
};

export default Math;
