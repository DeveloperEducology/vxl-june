import React, { useState } from "react";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";

// Initial data
const initialItems = [
  { id: 1, name: "Apple", group: "left" },
  { id: 2, name: "Tiger", group: "right" },
  { id: 3, name: "Banana", group: "left" },
  { id: 4, name: "Lion", group: "right" },
  { id: 5, name: "Mango", group: "left" },
  { id: 6, name: "Elephant", group: "right" },
];

const DragSortBuckets = () => {
  const [unplacedItems, setUnplacedItems] = useState([...initialItems]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [feedback, setFeedback] = useState("");

  const reset = () => {
    setUnplacedItems([...initialItems]);
    setLeftItems([]);
    setRightItems([]);
    setFeedback("");
  };

  const validate = () => {
    const correctLeft = initialItems
      .filter((i) => i.group === "left")
      .map((i) => i.name)
      .sort();
    const correctRight = initialItems
      .filter((i) => i.group === "right")
      .map((i) => i.name)
      .sort();

    const userLeft = leftItems.map((i) => i.name).sort();
    const userRight = rightItems.map((i) => i.name).sort();

    const leftMatch = JSON.stringify(correctLeft) === JSON.stringify(userLeft);
    const rightMatch =
      JSON.stringify(correctRight) === JSON.stringify(userRight);

    setFeedback(
      leftMatch && rightMatch
        ? "✅ Perfect! Well sorted."
        : "❌ Incorrect. Try again."
    );
  };

  return (
    <div style={styles.container}>
      <h2>🧠 Drag the words to their correct category</h2>

      <div style={styles.topGridWrapper}>
        <h3>🗂️ Available Words</h3>
        <ReactSortable
          list={unplacedItems}
          setList={setUnplacedItems}
          group={{ name: "shared", pull: true, put: false }} // ✅ now it moves!
          animation={200}
          sort={false}
          style={styles.topGrid}
        >
          {unplacedItems.map((item) => (
            <div key={item.id} style={styles.card}>
              {item.name}
            </div>
          ))}
        </ReactSortable>
      </div>

      <div style={styles.columns}>
        <div style={styles.columnBox}>
          <h3>🍎 Fruits</h3>
          <ReactSortable
            list={leftItems}
            setList={setLeftItems}
            group={{ name: "shared", pull: true, put: true }}
            animation={200}
            style={styles.dropZone}
          >
            {leftItems.map((item) => (
              <div key={item.id} style={styles.leftCard}>
                {item.name}
              </div>
            ))}
          </ReactSortable>
        </div>

        <div style={styles.columnBox}>
          <h3>🦁 Animals</h3>
          <ReactSortable
            list={rightItems}
            setList={setRightItems}
            group={{ name: "shared", pull: true, put: true }}
            animation={200}
            style={styles.dropZone}
          >
            {rightItems.map((item) => (
              <div key={item.id} style={styles.rightCard}>
                {item.name}
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>

      <div style={styles.buttons}>
        <button onClick={reset} style={styles.button}>
          🔁 Reset
        </button>
        <button onClick={validate} style={styles.button}>
          ✅ Validate
        </button>
      </div>

      {feedback && (
        <div
          style={{
            marginTop: 20,
            fontWeight: "bold",
            fontSize: "18px",
            color: feedback.includes("✅") ? "green" : "red",
          }}
        >
          {feedback}
        </div>
      )}

      <style>{`
        .sortable-chosen {
          transform: scale(1.05);
          z-index: 100;
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        .sortable-ghost {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  topGridWrapper: {
    marginBottom: "30px",
  },
  topGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    padding: "15px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    minHeight: "80px",
    marginTop: "10px",
  },
  columns: {
    display: "flex",
    justifyContent: "space-around",
    gap: "40px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  columnBox: {
    width: "100%",
    maxWidth: "350px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    minHeight: "200px",
    backgroundColor: "#f9f9f9",
  },
  dropZone: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    minHeight: "100px",
  },
  card: {
    padding: "10px 18px",
    backgroundColor: "#3498db",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "grab",
  },
  leftCard: {
    padding: "10px 18px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  rightCard: {
    padding: "10px 18px",
    backgroundColor: "#e67e22",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  buttons: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2980b9",
    color: "#fff",
    cursor: "pointer",
  },
};

export default DragSortBuckets;
