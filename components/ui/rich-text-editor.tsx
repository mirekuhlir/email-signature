import React, { useEffect, useState } from "react";

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const { content, onChange } = props;

  const [editText, setEditText] = useState(content?.text ?? "");
  const [editFontSize, setEditFontSize] = useState(content?.fontSize ?? "16");
  const [editLineHeight, setEditLineHeight] = useState(
    content?.lineHeight ?? "1",
  );
  const [editFontWeight, setEditFontWeight] = useState(
    content?.fontWeight ?? "normal",
  );
  const [editFontStyle, setEditFontStyle] = useState(
    content?.fontStyle ?? "normal",
  );
  const [editTextAlign, setEditTextAlign] = useState(
    content?.textAlign ?? "left",
  );
  const [editTextColor, setEditTextColor] = useState(
    content?.textColor ?? "#000000",
  );
  const [editBackgroundColor, setEditBackgroundColor] = useState(
    content?.backgroundColor ?? "transparent",
  );
  const [editTextDecoration, setEditTextDecoration] = useState(
    content?.textDecoration ?? "none",
  );
  const [editFontFamily, setEditFontFamily] = useState(
    content?.fontFamily ?? "Arial",
  );
  const [editLetterSpacing, setEditLetterSpacing] = useState(
    content?.letterSpacing ?? "0",
  );
  const [editTextTransform, setEditTextTransform] = useState(
    content?.textTransform ?? "none",
  );

  useEffect(() => {
    if (content) {
      setEditText(content.text ?? "");
      setEditFontSize(content.fontSize ?? "16");
      setEditLineHeight(content.lineHeight ?? "1");
      setEditFontWeight(content.fontWeight ?? "normal");
      setEditFontStyle(content.fontStyle ?? "normal");
      setEditTextAlign(content.textAlign ?? "left");
      setEditTextColor(content.textColor ?? "#000000");
      setEditBackgroundColor(content.backgroundColor ?? "transparent");
      setEditTextDecoration(content.textDecoration ?? "none");
      setEditFontFamily(content.fontFamily ?? "Arial");
      setEditLetterSpacing(content.letterSpacing ?? "0");
      setEditTextTransform(content.textTransform ?? "none");
    }
  }, [content]);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={editFontFamily}
            onChange={(e) => {
              setEditFontFamily(e.target.value);
              onChangeContent({ fontFamily: e.target.value });
            }}
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
            value={editLineHeight}
            onChange={(e) => {
              setEditLineHeight(e.target.value);
              onChangeContent({ lineHeight: e.target.value });
            }}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {lineHeights.map((height) => (
              <option key={height} value={height}>
                ×{height}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              toggleTextDecoration("underline");
              onChangeContent({ textDecoration: "underline" });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editTextDecoration === "underline" ? "bg-blue-200" : "bg-white"
            }`}
          >
            U
          </button>

          <button
            onClick={() => {
              toggleTextDecoration("line-through");
              onChangeContent({ textDecoration: "line-through" });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editTextDecoration === "line-through" ? "bg-blue-200" : "bg-white"
            }`}
          >
            S
          </button>

          {/*  TODO - font weight */}
          <button
            onClick={() => {
              setEditFontWeight(
                editFontWeight === "normal" ? "bold" : "normal",
              );
              onChangeContent({
                fontWeight: editFontWeight === "normal" ? "bold" : "normal",
              });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editFontWeight === "bold" ? "bg-blue-200" : "bg-white"
            }`}
          >
            B
          </button>

          <button
            onClick={() => {
              setEditFontStyle(
                editFontStyle === "normal" ? "italic" : "normal",
              );
              onChangeContent({
                fontStyle: editFontStyle === "normal" ? "italic" : "normal",
              });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${editFontStyle === "italic" ? "bg-blue-200" : "bg-white"}`}
          >
            I
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setEditTextAlign("left");
                onChangeContent({ textAlign: "left" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextAlign === "left" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => {
                setEditTextAlign("center");
                onChangeContent({ textAlign: "center" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextAlign === "center" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ↔
            </button>
            <button
              onClick={() => {
                setEditTextAlign("right");
                onChangeContent({ textAlign: "right" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextAlign === "right" ? "bg-blue-200" : "bg-white"
              }`}
            >
              →
            </button>
            <button
              onClick={() => {
                setEditTextAlign("justify");
                onChangeContent({ textAlign: "justify" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextAlign === "justify" ? "bg-blue-200" : "bg-white"
              }`}
            >
              ⇔
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => {
                setEditTextTransform("uppercase");
                onChangeContent({ textTransform: "uppercase" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "uppercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              AA
            </button>
            <button
              onClick={() => {
                setEditTextTransform("lowercase");
                onChangeContent({ textTransform: "lowercase" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "lowercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              aa
            </button>
            <button
              onClick={() => {
                setEditTextTransform("capitalize");
                onChangeContent({ textTransform: "capitalize" });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "capitalize" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Aa
            </button>
          </div>
        </div>

        {/* Rozšířené formátování */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={editLetterSpacing}
            onChange={(e) => {
              setEditLetterSpacing(e.target.value);
              onChangeContent({ letterSpacing: e.target.value });
            }}
            className="p-2 rounded border bg-white min-w-[100px]"
          >
            {letterSpacingOptions.map((spacing) => (
              <option key={spacing} value={spacing}>
                Mezery {spacing}px
              </option>
            ))}
          </select>

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
              value={editTextColor}
              onChange={(e) => {
                setEditTextColor(e.target.value);
                onChangeContent({ textColor: e.target.value });
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva pozadí:</span>
            <input
              type="color"
              value={editBackgroundColor || "transparent"}
              onChange={(e) => {
                const newColor = e.target.value || "transparent";
                setEditBackgroundColor(newColor);
                onChangeContent({ backgroundColor: newColor });
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/*   TODO - style */}
      <input
        className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        style={{
          fontSize: `${editFontSize}px`,
          lineHeight: editLineHeight,
          fontWeight: editFontWeight,
          fontStyle: editFontStyle,
          textAlign: editTextAlign as "left" | "center" | "right" | "justify",
          color: editTextColor,
          backgroundColor: editBackgroundColor,
          textDecoration: editTextDecoration,
          fontFamily: editFontFamily,
          letterSpacing: `${editLetterSpacing}px`,
          textTransform: editTextTransform as
            | "uppercase"
            | "lowercase"
            | "capitalize",
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
