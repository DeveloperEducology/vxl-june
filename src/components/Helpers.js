  // Helper to split a number into tens and units and format as sum
  export  const formatTensSum = (num) => {
    if (typeof num !== "number") return "";
    const tens = Math.floor(num / 10) * 10;
    const units = num % 10;
    if (tens === 0) return `${units}`;
    if (units === 0) return `${tens}`;
    return `${tens} + ${units}`;
  };
