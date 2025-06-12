import React, { useState, useEffect } from "react";

const MathRenderer = ({ latex }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    try {
      if (window.katex) {
        const rendered = window.katex.renderToString(latex, {
          throwOnError: false,
          errorColor: "#cc0000",
          displayMode: true,
          strict: "ignore",
        });
        setHtml(rendered);
      }
    } catch (error) {
      setHtml(
        `<span style="color:red">Error rendering: ${error.message}</span>`
      );
    }
  }, [latex]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const PREDEFINED_EQUATIONS = [
  // Algebra
  { label: "Linear Equation", latex: "<a>x + <b> = 0" },
  { label: "Quadratic Equation", latex: "<a>x^2 + <b>x + <c> = 0" },
  {
    label: "Quadratic Formula",
    latex: "x = \\frac{-<b> \\pm \\sqrt{<b>^2 - 4<a><c>}}{2<a>}",
  },
  {
    label: "Difference of Squares",
    latex: "<a>^2 - <b>^2 = (<a> - <b>)(<a> + <b>)",
  },
  { label: "Perfect Square", latex: "(<a> + <b>)^2 = <a>^2 + 2<a><b> + <b>^2" },

  // Calculus
  {
    label: "Derivative Definition",
    latex: "f'(<x>) = \\lim_{<h> \\to 0} \\frac{f(<x>+<h>) - f(<x>)}{<h>}",
  },
  { label: "Power Rule", latex: "\\frac{d}{d<x>}(<x>^{<n>}) = <n><x>^{<n>-1}" },
  {
    label: "Integral Power Rule",
    latex: "\\int <x>^{<n>} d<x> = \\frac{<x>^{<n>+1}}{<n>+1} + C",
  },

  // Geometry
  { label: "Area of Triangle", latex: "A = \\frac{1}{2}<b><h>" },
  { label: "Area of Circle", latex: "A = \\pi <r>^2" },
  { label: "Pythagorean Theorem", latex: "<a>^2 + <b>^2 = <c>^2" },

  // Trigonometry
  { label: "Sine Identity", latex: "\\sin^2 <x> + \\cos^2 <x> = 1" },
  {
    label: "Law of Cosines",
    latex: "<c>^2 = <a>^2 + <b>^2 - 2<a><b>\\cos <C>",
  },

  // Exponents and Logs
  {
    label: "Exponent Product Rule",
    latex: "<a>^{<m>} \\cdot <a>^{<n>} = <a>^{<m>+<n>}",
  },
  { label: "Log Product Rule", latex: "\\log(<a><b>) = \\log <a> + \\log <b>" },

  // Probability & Statistics
  { label: "Mean", latex: "\\mu = \\frac{1}{<n>} \\sum_{i=1}^{<n>} <x>_i" },
  {
    label: "Variance",
    latex: "\\sigma^2 = \\frac{1}{<n>} \\sum_{i=1}^{<n>} (<x>_i - \\mu)^2",
  },
  {
    label: "Combination",
    latex: "C(<n>, <r>) = \\frac{<n>!}{<r>!(<n> - <r>)!}",
  },
];

const loadKatex = () => {
  return new Promise((resolve) => {
    if (window.katex) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js";
    script.integrity =
      "sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx";
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
    link.integrity =
      "sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
};

export default function MathEditor() {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [output, setOutput] = useState("");
  const [placeholders, setPlaceholders] = useState({});
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    loadKatex().then(() => setKatexLoaded(true));
  }, []);

  const handleSelect = (latex) => {
    setSelected(latex);
    setOutput(latex);

    const placeholderMatches = latex.match(/<[^>]+>/g) || [];
    const newPlaceholders = {};
    placeholderMatches.forEach((ph) => {
      if (!placeholders[ph]) {
        newPlaceholders[ph] = ph.replace(/[<>]/g, "");
      } else {
        newPlaceholders[ph] = placeholders[ph];
      }
    });
    setPlaceholders(newPlaceholders);
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustom(value);
    setSelected(null);
    setOutput(value);
    setPlaceholders({});
  };

  const handlePlaceholderChange = (placeholder, value) => {
    const newPlaceholders = { ...placeholders, [placeholder]: value };
    setPlaceholders(newPlaceholders);

    let newOutput = selected || custom;
    Object.entries(newPlaceholders).forEach(([ph, val]) => {
      const escapedPh = ph.replace(/[<>]/g, "\\$&");
      newOutput = newOutput.replace(new RegExp(escapedPh, "g"), val);
    });
    setOutput(newOutput);
  };

  if (!katexLoaded) {
    return <div className="p-4">Loading math renderer...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧮 Math Editor</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Choose an equation:</label>
        <select
          className="w-full p-2 border mb-4 rounded"
          onChange={(e) => handleSelect(e.target.value)}
          value={selected || ""}
        >
          <option value="">-- Select a predefined equation --</option>
          {PREDEFINED_EQUATIONS.map((eq, idx) => (
            <option key={idx} value={eq.latex}>
              {eq.label}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">
          Or enter LaTeX manually:
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="e.g. x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
          value={custom}
          onChange={handleCustomChange}
        />
      </div>

      {Object.keys(placeholders).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h3 className="text-lg font-semibold mb-3">Equation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(placeholders).map(([placeholder, value]) => (
              <div key={placeholder} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {placeholder.replace(/[<>]/g, "")}:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={value}
                  onChange={(e) =>
                    handlePlaceholderChange(placeholder, e.target.value)
                  }
                  placeholder={`Enter ${placeholder.replace(/[<>]/g, "")}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 p-4 rounded border">
        <h2 className="text-lg font-semibold mb-3">Rendered Output:</h2>
        {output ? (
          <MathRenderer latex={output} />
        ) : (
          <p className="text-gray-500">
            Select an equation or enter LaTeX to see the rendered output.
          </p>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Tip: Use standard LaTeX notation for equations. Placeholders like{" "}
          {"<a>"} can be replaced with your values.
        </p>
      </div>
    </div>
  );
}
