import React from "react";
import Plot from "react-plotly.js";

export default function InteractiveGraph({ graphConfig, onAnswer }) {
  const { title, xLabel, yLabel, points, lines } = graphConfig;

  return (
    <Plot
      data={[
        {
          x: points ? points.map((p) => p[0]) : [],
          y: points ? points.map((p) => p[1]) : [],
          mode: "markers",
          type: "scatter",
          marker: { size: 10, color: "blue" },
          name: "Points",
        },
        ...(lines
          ? [
              {
                x: lines.x,
                y: lines.y,
                mode: "lines",
                type: "scatter",
                line: { color: "red" },
                name: "Line",
              },
            ]
          : []),
      ]}
      layout={{
        title: title || "",
        xaxis: { title: xLabel || "x", zeroline: true },
        yaxis: { title: yLabel || "y", zeroline: true },
        showlegend: true,
      }}
      config={{ responsive: true }}
      onClick={(data) => {
        const clicked = data.points[0];
        if (onAnswer) {
          onAnswer({ x: clicked.x, y: clicked.y });
        }
      }}
    />
  );
}
