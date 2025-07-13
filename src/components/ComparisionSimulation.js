import React, { useState } from "react";
import { motion } from "framer-motion";

// Define the available items for selection
const items = [
  { id: "apple", icon: "🍎" },
  { id: "dog", icon: "🐶" },
  { id: "ball", icon: "⚽" },
  { id: "butterfly", icon: "🦋" },
];

console.log("items", items);

// Mock data for the comparison simulation
const mockData = {
  leftCount: 3,
  rightCount: 3,
};

export default function ComparisionSimulation() {
  // State to manage selected items and their counts
  const [leftItems, setLeftItems] = useState([
    { id: "apple", icon: "🍎" },
    { id: "dog", icon: "🐶" },
    { id: "ball", icon: "⚽" },
    { id: "butterfly", icon: "🦋" },
  ]);
  const [rightItems, setRightItems] = useState([]);

  console.log("leftItems", leftItems);

  // Function to add an item to the left side
  const addItemToLeft = (item) => {
    setLeftItems((prev) => [...prev, item]);
  };

  // Function to add an item to the right side
  const addItemToRight = (item) => {
    setRightItems((prev) => [...prev, item]);
  };

  // Function to remove an item from the left side
  const removeItemFromLeft = (index) => {
    setLeftItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to remove an item from the right side
  const removeItemFromRight = (index) => {
    setRightItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Render the comparison simulation
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Comparison Simulation
        </h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Reset
        </button>
      </header>

      {/* Comparison Section */}
      <div className="flex justify-around gap-8">
        {/* // Left Side with motion movement */}

        {/* Left Side */}
        <motion.div
          className="bg-white p-4 rounded shadow-md w-full max-w-sm"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <h2 className="text-xl font-bold mb-2">Left Side</h2>
          <p className="text-gray-600 mb-4">Count: {leftItems.length}</p>
          <div className="grid grid-cols-10 gap-2 mb-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10">
            {leftItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-200 rounded p-1 flex items-center justify-center cursor-pointer"
                onClick={() => removeItemFromLeft(index)}
                initial={{ scale: 0, opacity: 0, y: -30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 30 }}
                transition={{ type: "keyframes", stiffness: 300, damping: 20 }}
                layout
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-10 gap-2 mb-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10">
            {rightItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-200 rounded p-1 flex items-center justify-center cursor-pointer"
                onClick={() => removeItemFromRight(index)}
                initial={{ scale: 0, opacity: 0, y: -30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 30 }}
                transition={{ type: "keyframes", stiffness: 300, damping: 20 }}
                layout
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="bg-gray-200 rounded p-2 flex items-center justify-center cursor-pointer"
                onClick={() => addItemToLeft(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600">
        <p>Created with ❤️ using React and TailwindCSS</p>
      </footer>
    </div>
  );
}
