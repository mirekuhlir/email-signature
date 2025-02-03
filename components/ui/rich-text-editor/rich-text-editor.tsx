import { ContentType } from "@/const/content";
import React, { useEffect, useState, ChangeEvent } from "react";
import SelectBase from "../select-base";
import { FONTS, FONT_SIZES, LINE_HEIGHTS, LETTER_SPACINGS } from "./fonts";

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  // TODO - na základě content type sestavit layout - text editor, email (schovat zarování pro druhý text)
  contentType: ContentType;
  errorMessage?: string;
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const { content, onChange, errorMessage } = props;

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

  const onChangeContent = (updated: any) => {
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
      ...updated,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <SelectBase
            options={FONTS}
            value={editFontFamily}
            onChange={(value) => {
              setEditFontFamily(value);
              onChangeContent({ fontFamily: value });
            }}
          />

          <select
            value={editFontSize}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setEditFontSize(e.target.value);
              onChangeContent({ fontSize: e.target.value });
            }}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <select
            value={editLineHeight}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setEditLineHeight(e.target.value);
              onChangeContent({ lineHeight: e.target.value });
            }}
            className="p-2 rounded border bg-white min-w-[80px]"
          >
            {LINE_HEIGHTS.map((height) => (
              <option key={height} value={height}>
                ×{height}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const newDecoration =
                editTextDecoration === "underline" ? "none" : "underline";
              setEditTextDecoration(newDecoration);
              onChangeContent({ textDecoration: newDecoration });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editTextDecoration === "underline" ? "bg-blue-200" : "bg-white"
            }`}
          >
            U
          </button>

          <button
            onClick={() => {
              const newDecoration =
                editTextDecoration === "line-through" ? "none" : "line-through";
              setEditTextDecoration(newDecoration);
              onChangeContent({ textDecoration: newDecoration });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editTextDecoration === "line-through" ? "bg-blue-200" : "bg-white"
            }`}
          >
            S
          </button>

          <button
            onClick={() => {
              const newWeight = editFontWeight === "normal" ? "bold" : "normal";
              setEditFontWeight(newWeight);
              onChangeContent({ fontWeight: newWeight });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editFontWeight === "bold" ? "bg-blue-200" : "bg-white"
            }`}
          >
            B
          </button>

          <button
            onClick={() => {
              const newStyle = editFontStyle === "normal" ? "italic" : "normal";
              setEditFontStyle(newStyle);
              onChangeContent({ fontStyle: newStyle });
            }}
            className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
              editFontStyle === "italic" ? "bg-blue-200" : "bg-white"
            }`}
          >
            I
          </button>
        </div>

        {/* Alignment and Text Transform */}
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
                const newTransform =
                  editTextTransform === "uppercase" ? "none" : "uppercase";
                setEditTextTransform(newTransform);
                onChangeContent({ textTransform: newTransform });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "uppercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              AA
            </button>
            <button
              onClick={() => {
                const newTransform =
                  editTextTransform === "lowercase" ? "none" : "lowercase";
                setEditTextTransform(newTransform);
                onChangeContent({ textTransform: newTransform });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "lowercase" ? "bg-blue-200" : "bg-white"
              }`}
            >
              aa
            </button>
            <button
              onClick={() => {
                const newTransform =
                  editTextTransform === "capitalize" ? "none" : "capitalize";
                setEditTextTransform(newTransform);
                onChangeContent({ textTransform: newTransform });
              }}
              className={`p-2 rounded w-10 h-10 flex items-center justify-center ${
                editTextTransform === "capitalize" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Aa
            </button>
          </div>
        </div>

        {/* Extended Formatting */}
        <div className="flex flex-wrap gap-2 items-center p-2 border-b border-gray-200">
          <select
            value={editLetterSpacing}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setEditLetterSpacing(e.target.value);
              onChangeContent({ letterSpacing: e.target.value });
            }}
            className="p-2 rounded border bg-white min-w-[100px]"
          >
            {LETTER_SPACINGS.map((spacing) => (
              <option key={spacing} value={spacing}>
                Mezery {spacing}px
              </option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div className="flex flex-wrap gap-2 items-center p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva textu:</span>
            <input
              type="color"
              value={editTextColor}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newColor = e.target.value || "transparent";
                setEditBackgroundColor(newColor);
                onChangeContent({ backgroundColor: newColor });
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

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
            | "capitalize"
            | "none",
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
      {errorMessage && (
        <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
