import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function VerticalLineTestGraph({ graphConfig, onResult }) {
  const [clickedX, setClickedX] = useState(null);
  const points = graphConfig.points;

  const checkVerticalLine = (xVal) => {
    const yVals = points.filter(p => p[0] === xVal);
    if (yVals.length > 1) {
      onResult("❌ Not a function (vertical line intersects multiple points)");
    } else {
      onResult("✅ Function (each x has only one y)");
    }
  };

  return (
    <>
      <Plot
        data={[
          {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            mode: "markers",
            type: "scatter",
            marker: { size: 10, color: "blue" }
          }
        ]}
        layout={{ title: graphConfig.title }}
        onClick={(data) => {
          const clicked = data.points[0].x;
          setClickedX(clicked);
          checkVerticalLine(clicked);
        }}
      />
      {clickedX !== null && <p>Checked vertical line at x={clickedX}</p>}
    </>
  );
}
