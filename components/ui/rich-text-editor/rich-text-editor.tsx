import { ContentType } from "@/const/content";
import React, { useEffect, useState, ChangeEvent } from "react";
import SelectBase from "../select-base";
import { FONTS, FONT_SIZES, LINE_HEIGHTS, LETTER_SPACINGS } from "./fonts";
import { EditColor } from "../edit-color";

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  // TODO - na základě content type sestavit layout - text editor, email (schovat zarování pro druhý text)
  contentType: ContentType;
  errorMessage?: string;
}

const ButtonSquare = ({
  onClick,
  children,
  isSelected,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded w-20 h-10 flex items-center justify-center ${isSelected ? "bg-blue-200" : "bg-white"} ${className}`}
    >
      {children}
    </button>
  );
};

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

  // TODO - text color nebo color? změnit načíst
  // TODO - použít vlastní color picker?
  const [editTextColor, setEditTextColor] = useState(
    // TODO barva, použit rgba a bude to tady
    content?.color ?? "#000000",
  );
  const [editBackgroundColor, setEditBackgroundColor] = useState(
    // TODO barva
    content?.backgroundColor ?? "rgba(0, 0, 0, 0)",
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
      setEditTextColor(content.color ?? "#000000");
      setEditBackgroundColor(content.backgroundColor ?? "rgba(0, 0, 0, 0)");
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
      color: editTextColor,
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

  //TODO lokalizace

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <div className="grid grid-cols-1 gap-2 bg-gray-100 p-2 rounded">
        <div className="flex flex-col gap-2 p-2 border-b border-gray-200">
          <SelectBase
            options={FONTS}
            value={editFontFamily}
            label="Font"
            onChange={(value) => {
              setEditFontFamily(value);
              onChangeContent({ fontFamily: value });
            }}
          />

          <SelectBase
            options={FONT_SIZES}
            value={editFontSize}
            label="Font size"
            onChange={(value) => {
              setEditFontFamily(value);
              onChangeContent({ fontSize: value });
            }}
          />

          <SelectBase
            options={LINE_HEIGHTS}
            label="Line height"
            value={editLineHeight}
            onChange={(value) => {
              setEditFontFamily(value);
              onChangeContent({ lineHeight: value });
            }}
          />
        </div>

        <div className="flex gap-2 p-2 border-b border-gray-200">
          <ButtonSquare
            isSelected={editFontWeight === "bold"}
            onClick={() => {
              const newWeight = editFontWeight === "normal" ? "bold" : "normal";
              setEditFontWeight(newWeight);
              onChangeContent({ fontWeight: newWeight });
            }}
          >
            Bold
          </ButtonSquare>

          <ButtonSquare
            isSelected={editFontStyle === "italic"}
            onClick={() => {
              const newStyle = editFontStyle === "normal" ? "italic" : "normal";
              setEditFontStyle(newStyle);
              onChangeContent({ fontStyle: newStyle });
            }}
          >
            Italic
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextDecoration === "underline"}
            onClick={() => {
              const newDecoration =
                editTextDecoration === "underline" ? "none" : "underline";
              setEditTextDecoration(newDecoration);
              onChangeContent({ textDecoration: newDecoration });
            }}
          >
            Underline
          </ButtonSquare>
        </div>

        <div className="flex gap-2 p-2 border-b border-gray-200">
          <ButtonSquare
            isSelected={editTextAlign === "left"}
            onClick={() => {
              setEditTextAlign("left");
              onChangeContent({ textAlign: "left" });
            }}
          >
            Left
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextAlign === "center"}
            onClick={() => {
              setEditTextAlign("center");
              onChangeContent({ textAlign: "center" });
            }}
          >
            Center
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextAlign === "right"}
            onClick={() => {
              setEditTextAlign("right");
              onChangeContent({ textAlign: "right" });
            }}
          >
            Right
          </ButtonSquare>
        </div>

        <div className="flex gap-2 p-2 border-b border-gray-200">
          <ButtonSquare
            isSelected={editTextTransform === "uppercase"}
            onClick={() => {
              const newTransform =
                editTextTransform === "uppercase" ? "none" : "uppercase";
              setEditTextTransform(newTransform);
              onChangeContent({ textTransform: newTransform });
            }}
          >
            AA
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextTransform === "lowercase"}
            onClick={() => {
              const newTransform =
                editTextTransform === "lowercase" ? "none" : "lowercase";
              setEditTextTransform(newTransform);
              onChangeContent({ textTransform: newTransform });
            }}
          >
            aa
          </ButtonSquare>

          <ButtonSquare
            isSelected={editTextTransform === "capitalize"}
            onClick={() => {
              const newTransform =
                editTextTransform === "capitalize" ? "none" : "capitalize";
              setEditTextTransform(newTransform);
              onChangeContent({ textTransform: newTransform });
            }}
          >
            Aa
          </ButtonSquare>
        </div>

        <div className="flex gap-2 p-2 border-b border-gray-200">
          <SelectBase
            options={LETTER_SPACINGS}
            value={editLetterSpacing}
            label="Letter spacing"
            onChange={(value) => {
              setEditLetterSpacing(value);
              onChangeContent({ letterSpacing: value });
            }}
          />
        </div>

        <EditColor
          initColor={editTextColor}
          onChange={(color) => {
            setEditTextColor(color);
            onChangeContent({ color });
          }}
        />

        {/*     <div className="flex flex-wrap gap-2 items-center p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Barva pozadí:</span>
            <input
              type="color"
              value={editBackgroundColor || "rgba(0, 0, 0, 0)"}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newColor = e.target.value || "transparent";
                setEditBackgroundColor(newColor);
                onChangeContent({ backgroundColor: newColor });
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
        </div> */}
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
