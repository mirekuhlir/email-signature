import React, { useEffect, useState } from "react";

const RichTextEditor = (props: any) => {
  const { content, onChange } = props;

  const {
    text,
    fontSize,
    lineHeight,
    fontWeight,
    fontStyle,
    textAlign,
    textColor,
    backgroundColor,
    textDecoration,
    fontFamily,
    letterSpacing,
    textTransform,
    textShadow,
    /*     opacity, */
  } = content;

  const [editText, setEditText] = useState("");
  const [editFontSize, setEditFontSize] = useState("");
  const [editLineHeight, setEditLineHeight] = useState("");
  const [editFontWeight, setEditFontWeight] = useState("");
  const [editFontStyle, setEditFontStyle] = useState("");
  const [editTextAlign, setEditTextAlign] = useState("");
  const [editTextColor, setEditTextColor] = useState("");
  const [editBackgroundColor, setEditBackgroundColor] =
    useState(backgroundColor);
  const [editTextDecoration, setEditTextDecoration] = useState("");
  const [editFontFamily, setEditFontFamily] = useState("");
  const [editLetterSpacing, setEditLetterSpacing] = useState("");
  const [editTextTransform, setEditTextTransform] = useState("");
  const [editTextShadow, setEditTextShadow] = useState("");
  /*   const [editOpacity, setEditOpacity] = useState(""); */

  useEffect(() => {
    setEditText(text);
    setEditFontSize(fontSize);
    setEditLineHeight(lineHeight);
    setEditFontWeight(fontWeight);
    setEditFontStyle(fontStyle);
    setEditTextAlign(textAlign);
    setEditTextColor(textColor);
    setEditBackgroundColor(backgroundColor);
    setEditTextDecoration(textDecoration);
    setEditFontFamily(fontFamily);
    setEditLetterSpacing(letterSpacing);
    setEditTextTransform(textTransform);
    setEditTextShadow(textShadow);
    /*     setEditOpacity(opacity); */
  }, [
    text,
    fontSize,
    lineHeight,
    fontWeight,
    fontStyle,
    textAlign,
    textColor,
    backgroundColor,
    textDecoration,
    fontFamily,
    letterSpacing,
    textTransform,
    textShadow,
    /*     opacity, */
  ]);

  const onChangeContent = (content: any) => {
    const editContent = {
      text: editText,
      fontSize: editFontSize,
      lineHeight: editLineHeight,
      fontWeight: editFontWeight,
      fontStyle: editFontStyle,
      textAlign: editTextAlign,
      textColor: editTextColor,
      backgroundColor: editBackgroundColor,
      textDecoration: editTextDecoration,
      fontFamily: editFontFamily,
      letterSpacing: editLetterSpacing,
      textTransform: editTextTransform,
      textShadow: editTextShadow,
    };

    onChange({
      ...editContent,
      ...content,
    });
  };

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
  // TODO - vybrat fonty, které budou fungovat, onstanta?
  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
  ];

  const toggleTextDecoration = (decoration: any) => {
    setEditTextDecoration((prev: any) =>
      prev === decoration ? "none" : decoration,
    );
  };

  const toggleTextTransform = (transform: any) => {
    setEditTextTransform((prev: any) =>
      prev === transform ? "none" : transform,
    );
  };

  const toggleTextShadow = () => {
    setEditTextShadow((prev: any) =>
      prev === "none" ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
    );
  };

  //  TODO - donplnit všude onChangeContent

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        {/* Základní formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={fontFamily}
            onChange={(e) => setEditFontFamily(e.target.value)}
            className="p-2 rounded border bg-white min-w-[120px]"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            value={editFontSize}
            onChange={(e) => {
              setEditFontSize(e.target.value);
              onChangeContent({
                fontSize: e.target.value,
              });
            }}
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
            onChange={(e) => setEditLineHeight(e.target.value)}
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
              onClick={() => setEditTextAlign("left")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "left" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => setEditTextAlign("center")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "center" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ↔
            </button>
            <button
              onClick={() => setEditTextAlign("right")}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                textAlign === "right" ? "bg-blue-200" : "bg-white"
              }`}
            >
              →
            </button>
            <button
              onClick={() => setEditTextAlign("justify")}
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
            onChange={(e) => setEditLetterSpacing(e.target.value)}
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
          {/* 
          <input
            type="range"
            min="0"
            max="100"
            value={opacity.toString()}
            onChange={(e) => setEditOpacity(Number(e.target.value))}
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: "#4A90E2",
            }}
          />
          <span className="text-sm">Průhlednost: {opacity}%</span> */}
        </div>

        {/* Barvy */}
        <div className="flex flex-wrap gap-2 items-center p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva textu:</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setEditTextColor(e.target.value)}
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
              onChange={(e) => setEditBackgroundColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/*   TODO - style */}
      <input
        className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
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
          /*           opacity: opacity / 100, */
        }}
        onChange={(e) => {
          setEditText(e.target.value);
          onChangeContent({
            text: e.target.value,
          });
        }}
        role="textbox"
        aria-label="Text editor"
        value={editText}
      />
    </div>
  );
};

export default RichTextEditor;
