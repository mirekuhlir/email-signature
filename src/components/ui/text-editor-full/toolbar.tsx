import React from "react";
import { FormatButton } from "./format-button";

interface ToolbarProps {
  onFormatClick: (command: string, value?: string) => void;
  onColorClick: (e: React.MouseEvent) => void;
  onFontChange: (font: string) => void;
  fonts: { value: string; label: string }[];
}

export function Toolbar({
  onFormatClick,
  onColorClick,
  onFontChange,
  fonts,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b">
      {/* Font Family Select */}
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => onFontChange(e.target.value)}
          className="h-8 px-2 border rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          defaultValue={fonts[0].value}
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Text Formatting */}
      <div className="flex gap-2">
        <FormatButton
          onClick={() => onFormatClick("bold")}
          label="B"
          title="Bold"
        />
        <FormatButton
          onClick={() => onFormatClick("italic")}
          label="I"
          title="Italic"
        />
        <FormatButton
          onClick={() => onFormatClick("underline")}
          label="U"
          title="Underline"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Alignment */}
      <div className="flex gap-2">
        <FormatButton
          onClick={() => onFormatClick("justifyLeft")}
          label="⌫"
          title="Align Left"
        />
        <FormatButton
          onClick={() => onFormatClick("justifyCenter")}
          label="≡"
          title="Center"
        />
        <FormatButton
          onClick={() => onFormatClick("justifyRight")}
          label="⌦"
          title="Align Right"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Color Picker */}
      <div className="flex gap-2">
        <button
          onClick={onColorClick}
          className="h-8 px-3 border rounded text-sm hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          title="Text Color"
        >
          <span className="text-lg">🎨</span>
        </button>
      </div>
    </div>
  );
}
