import React from "react";
import "./MathTopicsList.css";
import { useNavigate } from "react-router-dom";
import {class2_maths_topicList} from '../data/Topics/Class2_maths'
const topicsData = {
  "A.0 Even or Odd": { category: "Number System", grade: "1-3" },
  "🔢 Number Line": { category: "Number System", grade: "1-3" },
  "A.1 Skip Counting": { category: "Number System", grade: "1-3" },
  "A.2 Place Value": { category: "Number System", grade: "2-4" },
  "A.3 Odd or Even": { category: "Number System", grade: "2-3" },
  "A.4 Compare Numbers": { category: "Number System", grade: "2-4" },
  "A.5 Number Line Estimation": { category: "Number System", grade: "3-5" },
  "A.6 Rounding Off": { category: "Number System", grade: "3-5" },
  "B.1 Addition": { category: "Operations", grade: "1-3" },
  "B.2 Subtraction": { category: "Operations", grade: "1-3" },
  "B.3 Multiplication": { category: "Operations", grade: "2-5" },
  "B.4 Division": { category: "Operations", grade: "3-5" },
  "B.5 Missing Operator": { category: "Operations", grade: "3-6" },
  "B.6 Order of Operations": { category: "Operations", grade: "5-8" },
  "C.1 Fractions": { category: "Fractions", grade: "3-5" },
  "C.2 Equivalent Fractions": { category: "Fractions", grade: "4-6" },
  "C.3 Add/Subtract Fractions": { category: "Fractions", grade: "4-6" },
  "C.4 Multiply Fractions": { category: "Fractions", grade: "5-7" },
  "D.1 Decimal Comparison": { category: "Decimals", grade: "4-6" },
  "D.2 Add/Subtract Decimals": { category: "Decimals", grade: "4-6" },
  "D.3 Convert Fraction to Decimal": { category: "Decimals", grade: "5-7" },
  "E.1 Time Conversion": { category: "Time", grade: "3-5" },
  "E.2 Elapsed Time": { category: "Time", grade: "4-6" },
  "F.1 Money - Add/Subtract": { category: "Money", grade: "2-4" },
  "F.2 Word Problems (Money)": { category: "Money", grade: "3-5" },
  "G.1 Measurement Units": { category: "Measurement", grade: "3-6" },
  "G.2 Perimeter": { category: "Geometry", grade: "4-6" },
  "G.3 Area of Rectangles": { category: "Geometry", grade: "4-6" },
  "G.4 Volume Cubes": { category: "Geometry", grade: "5-7" },
  "G.5 Convert Metric Units": { category: "Measurement", grade: "4-7" },
  "H.1 Patterns": { category: "Algebra", grade: "3-5" },
  "H.2 Simple Equations": { category: "Algebra", grade: "5-7" },
  "H.3 Inequalities": { category: "Algebra", grade: "6-8" },
  "I.1 Bar Graph Interpretation": { category: "Data Handling", grade: "3-6" },
  "I.2 Pictographs": { category: "Data Handling", grade: "2-4" },
  "I.3 Mean, Median, Mode": { category: "Statistics", grade: "6-8" },
  "J.1 Probability Basics": { category: "Probability", grade: "6-8" },
  "J.2 Coin Toss": { category: "Probability", grade: "6-7" },
  "K.1 Roman Numerals": { category: "Number System", grade: "4-6" },
  "K.2 Factors & Multiples": { category: "Number Theory", grade: "4-6" },
  "K.3 Prime vs Composite": { category: "Number Theory", grade: "5-6" },
  "K.4 LCM & HCF": { category: "Number Theory", grade: "5-7" },
  "L.1 Symmetry": { category: "Geometry", grade: "5-7" },
  "L.2 Angles": { category: "Geometry", grade: "5-7" },
  "L.3 Types of Triangles": { category: "Geometry", grade: "5-7" },
  "L.4 Coordinate Points": { category: "Geometry", grade: "6-8" },
  "M.1 Percentages": { category: "Ratio & Proportion", grade: "6-8" },
  "M.2 Simple Interest": { category: "Financial Math", grade: "6-8" },
  "M.3 Ratio Comparison": { category: "Ratio & Proportion", grade: "5-7" },
  "M.4 Speed, Distance, Time": { category: "Applications", grade: "6-8" },
  "N.1 Word Problems (Mixed)": { category: "Mixed Skills", grade: "3-8" },
};

const MathTopicsList = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicKey) => {
    navigate(`/kid/${encodeURIComponent(topicKey)}`);
  };

  const groupedTopics = Object.entries(class2_maths_topicList).reduce(
    (acc, [key, value]) => {
      if (!acc[value.category]) acc[value.category] = [];
      acc[value.category].push({ key, ...value });
      return acc;
    },
    {}
  );

  return (
    <div className="container">
      <h1 className="title">🎓 Math Playground</h1>
      <p className="subtitle">Choose a topic to begin learning!</p>

      {Object.entries(groupedTopics).map(([category, topics]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <ul className="topic-list">
            {topics.map((topic) => (
              <li
                key={topic.key}
                className="topic-item"
                onClick={() => handleTopicClick(topic.key)}
              >
                <span className="topic-code">{topic.key}</span>{" "}
                <span className="grade-tag">Grades {topic.grade}</span>
                {/* {topic.key.replace(/^[A-Z]\.\d+\s/, '')} */}
                {/* <span className="grade-tag">Grades {topic.grade}</span> */}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MathTopicsList;
