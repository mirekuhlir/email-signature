import React, { useState } from "react";

const RichTextEditor = () => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("16");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [textDecoration, setTextDecoration] = useState("none");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [letterSpacing, setLetterSpacing] = useState("0");
  const [textTransform, setTextTransform] = useState("none");
  const [textShadow, setTextShadow] = useState("none");
  const [opacity, setOpacity] = useState(100);

  const fontSizes = [
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
    "40",
    "48",
  ];
  const lineHeights = ["1", "1.25", "1.5", "1.75", "2", "2.5"];
  const letterSpacingOptions = ["0", "1", "2", "4", "8"];
  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
  ];

  const toggleTextDecoration = (decoration: any) => {
    setTextDecoration((prev) => (prev === decoration ? "none" : decoration));
  };

  const toggleTextTransform = (transform: any) => {
    setTextTransform((prev) => (prev === transform ? "none" : transform));
  };

  const toggleTextShadow = () => {
    setTextShadow((prev) =>
      prev === "none" ? "2px 2px 4px rgba(0,0,0,0.3)" : "none"
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        {/* Základní formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 rounded border bg-white min-w-[120px]"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <select
            value={lineHeight}
            onChange={(e) => setLineHeight(e.target.value)}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {lineHeights.map((height) => (
              <option key={height} value={height}>
                ×{height}
              </option>
            ))}
          </select>

          <button
            onClick={() => toggleTextDecoration("underline")}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              textDecoration === "underline" ? "bg-blue-200" : "bg-white"
            }`}
          >
            U
          </button>

          <button
            onClick={() => toggleTextDecoration("line-through")}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              textDecoration === "line-through" ? "bg-blue-200" : "bg-white"
            }`}
          >
            S
          </button>
        </div>

        {/* Zarovnání a transformace */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setTextAlign("left")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "left" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => setTextAlign("center")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "center" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ↔
            </button>
            <button
              onClick={() => setTextAlign("right")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "right" ? "bg-blue-200" : "bg-white"
              }`}
            >
              →
            </button>
            <button
              onClick={() => setTextAlign("justify")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "justify" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ⇔
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => toggleTextTransform("uppercase")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textTransform === "uppercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              AA
            </button>
            <button
              onClick={() => toggleTextTransform("lowercase")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textTransform === "lowercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              aa
            </button>
            <button
              onClick={() => toggleTextTransform("capitalize")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textTransform === "capitalize" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Aa
            </button>
          </div>
        </div>

        {/* Rozšířené formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(e.target.value)}
            className="p-2 rounded border bg-white min-w-[100px]"
          >
            {letterSpacingOptions.map((spacing) => (
              <option key={spacing} value={spacing}>
                Mezery {spacing}px
              </option>
            ))}
          </select>

          <button
            onClick={toggleTextShadow}
            className={`p-2 rounded flex items-center justify-center ${
              textShadow !== "none" ? "bg-blue-200" : "bg-white"
            }`}
          >
            Stín
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={opacity.toString()}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: "#4A90E2",
            }}
          />
          <span className="text-sm">Průhlednost: {opacity}%</span>
        </div>

        {/* Barvy */}
        <div className="flex flex-wrap gap-2 items-center p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva textu:</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva pozadí:</span>
            <input
              type="color"
              value={
                backgroundColor === "transparent" ? "#ffffff" : backgroundColor
              }
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div
        contentEditable
        className="w-full min-h-[200px] p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textAlign: textAlign as "left" | "center" | "right" | "justify",
          color: textColor,
          backgroundColor: backgroundColor,
          textDecoration: textDecoration,
          fontFamily: fontFamily,
          letterSpacing: `${letterSpacing}px`,
          textTransform: textTransform as
            | "uppercase"
            | "lowercase"
            | "capitalize",
          textShadow: textShadow,
          opacity: opacity / 100,
        }}
        onInput={(e) => setText(e.currentTarget.textContent || "")}
        role="textbox"
        aria-label="Text editor"
      />
    </div>
  );
};

export default RichTextEditor;
