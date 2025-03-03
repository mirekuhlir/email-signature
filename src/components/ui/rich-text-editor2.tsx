import React, { useState, useRef, useEffect } from "react";

const RichTextEditor2 = () => {
  const [lines, setLines] = useState([
    {
      id: "1",
      text: "",
      fontSize: "16",
      lineHeight: "1.5",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
      textColor: "#000000",
      backgroundColor: "transparent",
      textDecoration: "none",
      fontFamily: "Arial",
      letterSpacing: "0",
      textTransform: "none",
      textShadow: "none",
      opacity: 100,
    },
  ]);

  const [selectedLineId, setSelectedLineId] = useState("1");
  const inputRefs = useRef({});

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

  useEffect(() => {
    if (
      selectedLineId &&
      inputRefs.current &&
      selectedLineId in inputRefs.current
    ) {
      (
        inputRefs.current[
          selectedLineId as keyof typeof inputRefs.current
        ] as HTMLInputElement
      ).focus();
    }
  }, [selectedLineId, lines.length]);

  const updateLineProperty = (property: any, value: any) => {
    setLines((prevLines) =>
      prevLines.map((line) =>
        line.id === selectedLineId ? { ...line, [property]: value } : line,
      ),
    );
  };

  const toggleTextDecoration = (decoration: any) => {
    const selectedLine = lines.find((line) => line.id === selectedLineId);
    updateLineProperty(
      "textDecoration",
      selectedLine?.textDecoration === decoration ? "none" : decoration,
    );
  };

  const toggleTextTransform = (transform: any) => {
    const selectedLine = lines.find((line) => line.id === selectedLineId);
    updateLineProperty(
      "textTransform",
      selectedLine?.textTransform === transform ? "none" : transform,
    );
  };

  const toggleTextShadow = () => {
    const selectedLine = lines.find((line) => line.id === selectedLineId);
    updateLineProperty(
      "textShadow",
      selectedLine?.textShadow === "none"
        ? "2px 2px 4px rgba(0,0,0,0.3)"
        : "none",
    );
  };

  const handleLineClick = (lineId: any) => {
    setSelectedLineId(lineId);
  };

  const handleKeyDown = (e: any, lineIndex: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newId = Date.now().toString();
      const currentLine = lines[lineIndex];

      setLines((prevLines) => [
        ...prevLines.slice(0, lineIndex + 1),
        {
          ...currentLine,
          id: newId,
          text: "",
        },
        ...prevLines.slice(lineIndex + 1),
      ]);

      setSelectedLineId(newId);
    } else if (
      e.key === "Backspace" &&
      lines[lineIndex].text === "" &&
      lines.length > 1
    ) {
      e.preventDefault();
      const newLines = lines.filter((_, index) => index !== lineIndex);
      setLines(newLines);
      const newSelectedIndex = Math.max(0, lineIndex - 1);
      setSelectedLineId(newLines[newSelectedIndex].id);
    }
  };

  const handleLineChange = (lineId: any, newText: any) => {
    setLines((prevLines) =>
      prevLines.map((line) =>
        line.id === lineId ? { ...line, text: newText } : line,
      ),
    );
  };

  const selectedLine =
    lines.find((line) => line.id === selectedLineId) || lines[0];

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        {/* Základní formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={selectedLine.fontFamily}
            onChange={(e) => updateLineProperty("fontFamily", e.target.value)}
            className="p-2 rounded border bg-white min-w-[120px]"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            value={selectedLine.fontSize}
            onChange={(e) => updateLineProperty("fontSize", e.target.value)}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <select
            value={selectedLine.lineHeight}
            onChange={(e) => updateLineProperty("lineHeight", e.target.value)}
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
              selectedLine.textDecoration === "underline"
                ? "bg-blue-200"
                : "bg-white"
            }`}
          >
            U
          </button>

          <button
            onClick={() => toggleTextDecoration("line-through")}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              selectedLine.textDecoration === "line-through"
                ? "bg-blue-200"
                : "bg-white"
            }`}
          >
            S
          </button>
        </div>

        {/* Zarovnání a transformace */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => updateLineProperty("textAlign", "left")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textAlign === "left" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => updateLineProperty("textAlign", "center")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textAlign === "center" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ↔
            </button>
            <button
              onClick={() => updateLineProperty("textAlign", "right")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textAlign === "right" ? "bg-blue-200" : "bg-white"
              }`}
            >
              →
            </button>
            <button
              onClick={() => updateLineProperty("textAlign", "justify")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textAlign === "justify"
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              ⇔
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => toggleTextTransform("uppercase")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textTransform === "uppercase"
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              AA
            </button>
            <button
              onClick={() => toggleTextTransform("lowercase")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textTransform === "lowercase"
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              aa
            </button>
            <button
              onClick={() => toggleTextTransform("capitalize")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                selectedLine.textTransform === "capitalize"
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              Aa
            </button>
          </div>
        </div>

        {/* Rozšířené formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={selectedLine.letterSpacing}
            onChange={(e) =>
              updateLineProperty("letterSpacing", e.target.value)
            }
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
              selectedLine.textShadow !== "none" ? "bg-blue-200" : "bg-white"
            }`}
          >
            Stín
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={selectedLine.opacity}
            onChange={(e) =>
              updateLineProperty("opacity", Number(e.target.value))
            }
            className="w-24"
          />
          <span className="text-sm">Průhlednost: {selectedLine.opacity}%</span>
        </div>

        {/* Barvy */}
        <div className="flex flex-wrap gap-2 items-center p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva textu:</span>
            <input
              type="color"
              value={selectedLine.textColor}
              onChange={(e) => updateLineProperty("textColor", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva pozadí:</span>
            <input
              type="color"
              value={
                selectedLine.backgroundColor === "transparent"
                  ? "#ffffff"
                  : selectedLine.backgroundColor
              }
              onChange={(e) =>
                updateLineProperty("backgroundColor", e.target.value)
              }
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="w-full min-h-[200px] p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
        {/*     {lines.map((line, index) => (
          <div
            key={line.id}
            onClick={() => handleLineClick(line.id)}
            className={`min-h-[24px] ${
              selectedLineId === line.id ? "ring-2 ring-blue-200" : ""
            }`}
          >
            <input
              ref={(el) => {
                if (el && inputRefs.current) {
                  inputRefs.current[line.id as keyof typeof inputRefs.current] =
                    el;
                }
              }}
              type="text"
              value={line.text}
              onChange={(e) => handleLineChange(line.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full bg-transparent border-none focus:outline-none"
              style={{
                fontSize: `${line.fontSize}px`,
                lineHeight: line.lineHeight,
                fontWeight: line.fontWeight,
                fontStyle: line.fontStyle,
                textAlign: line.textAlign,
                color: line.textColor,
                backgroundColor: line.backgroundColor,
                textDecoration: line.textDecoration,
                fontFamily: line.fontFamily,
                letterSpacing: `${line.letterSpacing}px`,
                textTransform: line.textTransform,
                textShadow: line.textShadow,
                opacity: line.opacity / 100,
              }}
            />
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default RichTextEditor2;
