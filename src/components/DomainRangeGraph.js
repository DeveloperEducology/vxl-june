import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function DomainRangeGraph({ graphConfig, onSelection }) {
  const [selected, setSelected] = useState([]);
  const points = graphConfig.points;

  return (
    <>
      <Plot
        data={[
          {
            x: points.map(p => p[0]),
            y: points.map(p => p[1]),
            mode: "markers",
            type: "scatter",
            marker: { size: 10, color: "green" }
          }
        ]}
        layout={{ title: graphConfig.title }}
        onClick={(data) => {
          const p = [data.points[0].x, data.points[0].y];
          setSelected(prev => [...prev, p]);
          const domain = [...new Set([...selected, p].map(pt => pt[0]))];
          const range = [...new Set([...selected, p].map(pt => pt[1]))];
          onSelection({ domain, range });
        }}
      />
      <p>Selected Domain: {selected.map(p=>p[0]).join(", ")}</p>
      <p>Selected Range: {selected.map(p=>p[1]).join(", ")}</p>
    </>
  );
}
