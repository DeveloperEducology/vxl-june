export const data = [
  {
    "id": "C.1.001",
    "skill": "C.1 Relations: convert formats",
    "questionType": "convert",
    "questionText": "Convert the list of points {(1,2), (2,4), (3,6)} into a table.",
    "data": {
      "points": [[1,2], [2,4], [3,6]]
    },
    "answerType": "table",
    "correctAnswer": {
      "headers": ["x", "y"],
      "rows": [[1,2],[2,4],[3,6]]
    }
  },
  {
    "id": "C.2.001",
    "skill": "C.2 Domain and Range",
    "questionType": "domain-range",
    "questionText": "Find the domain and range of {(–2,1), (0,3), (4,5)}.",
    "data": {
      "points": [[-2,1],[0,3],[4,5]]
    },
    "answerType": "text",
    "correctAnswer": {
      "domain": [-2,0,4],
      "range": [1,3,5]
    }
  },
  {
    "id": "C.3.001",
    "skill": "C.3 Identify independent & dependent variables",
    "questionType": "identify-vars",
    "questionText": "In the equation y = 3x + 2, which variable is dependent?",
    "answerType": "text",
    "correctAnswer": "y"
  },
  {
    "id": "C.4.001",
    "skill": "C.4 Identify functions",
    "questionType": "function-check",
    "questionText": "Is {(1,2), (1,3), (2,4)} a function?",
    "data": {
      "points": [[1,2],[1,3],[2,4]]
    },
    "answerType": "yes-no",
    "options": ["Yes","No"],
    "correctAnswer": "No"
  },
  {
    "id": "C.5.001",
    "skill": "C.5 Vertical Line Test",
    "questionType": "vertical-line-test",
    "questionText": "Use the vertical line test on this graph. Is it a function?",
    "data": {
      "graph": {
        "title": "Circle Graph",
        "points": [[1,1],[1,-1],[-1,1],[-1,-1]]
      }
    },
    "answerType": "yes-no",
    "options": ["Yes","No"],
    "correctAnswer": "No"
  },
  {
    "id": "C.6.001",
    "skill": "C.6 Find values from graph",
    "questionType": "graph-read",
    "questionText": "From the graph of f(x)=2x+1, find f(2).",
    "data": {
      "graph": {
        "title": "f(x)=2x+1",
        "points": [[0,1],[1,3],[2,5],[3,7]],
        "lines": {
          "x": [0,1,2,3],
          "y": [1,3,5,7]
        }
      }
    },
    "answerType": "numeric",
    "correctAnswer": 5
  },
  {
    "id": "C.7.001",
    "skill": "C.7 Evaluate a function",
    "questionType": "evaluate",
    "questionText": "If f(x)=x²+3, find f(4).",
    "answerType": "numeric",
    "correctAnswer": 19
  },
  {
    "id": "C.8.001",
    "skill": "C.8 Evaluate with expression",
    "questionType": "evaluate",
    "questionText": "If f(x)=2x+1, find f(a+3).",
    "answerType": "text",
    "correctAnswer": "2a+7"
  },
  {
    "id": "C.9.001",
    "skill": "C.9 Complete table from graph",
    "questionType": "fill-table",
    "questionText": "Complete the table for x = -1,0,2 using the graph.",
    "data": {
      "graph": {
        "title": "f(x)=x²",
        "points": [[-1,1],[0,0],[2,4]],
        "lines": {
          "x": [-1,0,2],
          "y": [1,0,4]
        }
      }
    },
    "answerType": "table",
    "correctAnswer": {
      "headers": ["x","f(x)"],
      "rows": [[-1,1],[0,0],[2,4]]
    }
  },
  {
    "id": "C.10.001",
    "skill": "C.10 Complete table from equation",
    "questionType": "fill-table",
    "questionText": "Complete the table for f(x)=2x-1 for x=-1,1,3.",
    "data": {
      "xValues": [-1,1,3]
    },
    "answerType": "table",
    "correctAnswer": {
      "headers": ["x","f(x)"],
      "rows": [[-1,-3],[1,1],[3,5]]
    }
  },
  {
    "id": "C.11.001",
    "skill": "C.11 Interpret graph word problem",
    "questionType": "interpret-graph",
    "questionText": "The graph shows a car’s distance over time. When did it stop moving?",
    "data": {
      "graph": {
        "title": "Car distance vs. time",
        "points": [[0,0],[1,20],[2,40],[3,40],[4,60]]
      }
    },
    "answerType": "numeric",
    "correctAnswer": 2
  }
]
